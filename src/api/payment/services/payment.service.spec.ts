import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, bookingStatus } from '../../booking/models/booking.entity';
import { BookingService } from '../../booking/services/booking.service';
import { DataSource } from 'typeorm';
import { TestUtils } from '../../../utils/testUtils';
import { Payment } from '../models/payment.entity';
import { PaymentService } from './payment.service';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { BadRequestException, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import utils from '../../../utils/utils';
import { CarService } from '../../car/services/car.service';
import { Car } from '../../car/models/car.entity';
import { User } from '../../user/models/user.entity';
import { CarAttribute } from '../../car/models/carAttribute.entity';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';
import { CarModule } from '../../car/car.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { BookedRecord } from '../../booking/models/bookedRecord.entity';

describe('PaymentService', () => {
  let moduleRef: TestingModule;
  let paymentService: PaymentService;
  let testUtils: TestUtils;
  let bookingService: BookingService;
  let carService: CarService;
  let stripeService: StripeService;
  let bookingRequest, userRequest;
  const mockedCar = {
    id: '3926cd59-cd4b-4bbc-821d-21800019780f',
    name: 'New Car 1',
    description: 'New Car',
  };
  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        NestjsFormDataModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
        }),
        AuthModule,
        UserModule,
        CarModule,
        TypeOrmModule.forFeature([Payment]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Booking]),
        TypeOrmModule.forFeature([BookedRecord]),
        TypeOrmModule.forFeature([Car]),
        TypeOrmModule.forFeature([CarAttribute]),
      ],
      providers: [PaymentService, BookingService, StripeService],
    }).compile();
    stripeService = moduleRef.get(StripeService);
    paymentService = moduleRef.get(PaymentService);
    bookingService = moduleRef.get(BookingService);
    carService = moduleRef.get(CarService);
    testUtils = new TestUtils(moduleRef.get(DataSource));
    await testUtils.cleanAll(['booking', 'payment']);
    await testUtils.loadAll(['booking', 'payment']);
    jest
      .spyOn(carService, 'getCar')
      .mockImplementation(() => Promise.resolve(mockedCar as Car));
    bookingRequest = {
      userId: '63c4f298-a75e-424e-998e-55f396a97d61',
      carId: mockedCar.id,
      returnDateTime: '2018-01-15T08:54:45.000Z',
      receivedDateTime: '2018-01-25T08:54:45.000Z',
      amount: 4000,
      pickUpLocationId: '2711ad44-d7a2-4a3a-bcbe-c8d520d4ef6e',
    };
    userRequest = utils.loadJson('mocked_request');
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await moduleRef.close();
  });

  it('CreateCheckoutSession -> should create booking entity with pending status', async () => {
    jest
      .spyOn(stripeService, 'createCheckoutSession')
      .mockImplementation(() => expect.anything());

    await paymentService.createCheckoutSession(bookingRequest, userRequest);
    const newBookings = await bookingService.getCurrentUserBookings(
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

    await paymentService.createCheckoutSession(bookingRequest, userRequest);

    expect(mockFn).toBeCalledTimes(1);
  });

  it('handleIntentWebhook -> should update booking status when payment success', async () => {
    const mockedEventRequest = utils.loadJson(
      'intent_success_request',
    ) as RawBodyRequest<Request>;
    const mockedEvent = utils.loadJson(
      'intent_success_webhook',
    ) as Stripe.Event;

    const intentEvent = mockedEvent.data.object as Stripe.PaymentIntent;
    const testBooking = await bookingService.createBooking(
      bookingRequest,
      userRequest,
    );
    intentEvent.metadata.bookingId = testBooking.id;
    jest.spyOn(stripeService, 'constructEvent').mockReturnValue(mockedEvent);

    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.PENDING);

    await paymentService.handleIntentWebhook(mockedEventRequest);

    expect(await bookingService.getBooking(testBooking.id)).not.toBeNull();
    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.SUCCESS);
  });

  it('handleIntentWebhook -> should update booking status when payment failed', async () => {
    const mockedEventRequest = utils.loadJson(
      'intent_failed_request',
    ) as RawBodyRequest<Request>;
    const mockedEvent = utils.loadJson('intent_failed_webhook') as Stripe.Event;

    const intentEvent = mockedEvent.data.object as Stripe.PaymentIntent;
    const testBooking = await bookingService.createBooking(
      bookingRequest,
      userRequest,
    );
    intentEvent.metadata.bookingId = testBooking.id;
    jest.spyOn(stripeService, 'constructEvent').mockReturnValue(mockedEvent);

    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.PENDING);

    await paymentService.handleIntentWebhook(mockedEventRequest);

    expect(await bookingService.getBooking(testBooking.id)).not.toBeNull();
    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.FAIL);
  });

  it('handleIntentWebhook -> should update booking status when checkout session expires', async () => {
    const mockedEventRequest = utils.loadJson(
      'intent_failed_request',
    ) as RawBodyRequest<Request>;
    const mockedEvent = utils.loadJson('checkout_failed_event') as Stripe.Event;

    const intentEvent = mockedEvent.data.object as Stripe.Checkout.Session;
    const testBooking = await bookingService.createBooking(
      bookingRequest,
      userRequest,
    );
    intentEvent.metadata.bookingId = testBooking.id;
    jest.spyOn(stripeService, 'constructEvent').mockReturnValue(mockedEvent);

    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.PENDING);

    await paymentService.handleIntentWebhook(mockedEventRequest);

    expect(await bookingService.getBooking(testBooking.id)).not.toBeNull();
    expect(
      (await bookingService.getBooking(testBooking.id)).bookingStatus,
    ).toBe(bookingStatus.FAIL);
  });

  it('handleIntentWebhook -> should throw BadRequestException for incorrect signature', async () => {
    const mockedEventRequest = utils.loadJson(
      'intent_failed_request',
    ) as RawBodyRequest<Request>;
    const payload = {
      id: 'evt_test_webhook',
      object: 'event',
    };
    const payloadString = JSON.stringify(payload, null, 2);
    const secret = 'whsec_test_secret';
    const header = stripeService.generateTestHeaderString(
      payloadString,
      secret,
    );
    jest
      .spyOn(stripeService, 'constructEvent')
      .mockImplementationOnce(() =>
        stripeService.constructEvent(
          payloadString,
          header,
          process.env.STRIPE_INTENT_WEBHOOK_SIG_KEY,
        ),
      );
    await expect(
      paymentService.handleIntentWebhook(mockedEventRequest),
    ).rejects.toThrowError(BadRequestException);
  });
});
