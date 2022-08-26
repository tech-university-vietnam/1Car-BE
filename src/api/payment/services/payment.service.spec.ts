import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, bookingStatus } from '../../booking/models/booking.entity';
import { BookingService } from '../../booking/services/booking.service';
import { DataSource } from 'typeorm';
import { TestUtils } from '../../../utils/testUtils';
import { PaymentController } from '../controllers/payment.controller';
import { Payment } from '../models/payment.entity';
import { PaymentService } from './payment.service';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

describe('PaymentService', () => {
  let moduleRef: TestingModule;
  let paymentService: PaymentService;
  let testUtils: TestUtils;
  let bookingService: BookingService;
  let stripeService: StripeService;
  let bookingRequest;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Booking]),
        TypeOrmModule.forFeature([Payment]),
      ],
      controllers: [PaymentController],
      providers: [BookingService, PaymentService, StripeService],
    }).compile();

    stripeService = moduleRef.get(StripeService);
    paymentService = moduleRef.get(PaymentService);
    bookingService = moduleRef.get(BookingService);
    testUtils = new TestUtils(moduleRef.get(DataSource));
    await testUtils.cleanAll(['booking']);
    await testUtils.loadAll(['booking', 'payment']);

    bookingRequest = {
      userId: '2711ad44-d7a2-4a3a-bcbe-c8d520d4ef6f',
      carId: '2711ad44-d7a2-4a3a-bcbe-c8d520d4ef6e',
      returnDateTime: '2018-01-15T08:54:45.000Z',
      amount: 4000,
      pickUpLocationId: '2711ad44-d7a2-4a3a-bcbe-c8d520d4ef6e',
    };
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('CreateCheckoutSession -> should create booking entity with pending status', async () => {
    jest
      .spyOn(stripeService, 'createCheckoutSession')
      .mockImplementation(() => expect.anything());

    await paymentService.createCheckoutSession(bookingRequest);
    const newBookings = await bookingService.getBookingsByUserId(
      bookingRequest.userId,
    );

    expect(newBookings).toHaveLength(1);
    expect(newBookings[0]).toHaveProperty('carId', bookingRequest.carId);
    expect(newBookings[0]).toHaveProperty(
      'returnDateTime',
      new Date(bookingRequest.returnDateTime),
    );
    expect(newBookings[0]).toHaveProperty(
      'bookingStatus',
      bookingStatus.PENDING,
    );
  });

  it('CreateCheckoutSession -> should call stripe service', async () => {
    // Mock stripe service to avoid direct call to external service
    const mockFn = jest
      .spyOn(stripeService, 'createCheckoutSession')
      .mockImplementation(() => expect.anything());

    await paymentService.createCheckoutSession(bookingRequest);

    expect(mockFn).toBeCalledTimes(1);
  });

  it('handleIntentWebhook -> should update booking status when payment success', async () => {
    const mockedWebhookEvent = testUtils.loadJson(
      'intent_success_webhook',
    ) as Stripe.Event;
    const intentEvent = mockedWebhookEvent.data.object as Stripe.PaymentIntent;
    const testBooking = await bookingService.createBooking(bookingRequest);
    intentEvent.metadata.bookingId = testBooking.id;

    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.PENDING);

    await paymentService.handleIntentWebhook(mockedWebhookEvent);

    expect(await bookingService.getBooking(testBooking.id)).not.toBeNull();
    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.SUCCESS);
  });

  it('handleIntentWebhook -> should update booking status when payment faled', async () => {
    const mockedWebhookEvent = testUtils.loadJson(
      'intent_failed_webhook',
    ) as Stripe.Event;
    const intentEvent = mockedWebhookEvent.data.object as Stripe.PaymentIntent;
    const testBooking = await bookingService.createBooking(bookingRequest);
    intentEvent.metadata.bookingId = testBooking.id;

    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.PENDING);

    await paymentService.handleIntentWebhook(mockedWebhookEvent);

    expect(await bookingService.getBooking(testBooking.id)).not.toBeNull();
    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.FAIL);
  });
});
