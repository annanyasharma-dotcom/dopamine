/**
 * Hooman library registry: TATA 1mg character illustrations (Figma page “3d icons”, component sets
 * delivery-hooman, doctor, pharmacist, phlebotomist). Keys are `<character>-<pose>`, and `pose` is the
 * Figma variant name. `description` and `usage` are the guidance written in Figma.
 * Images are the Figma source PNGs on a transparent background, trimmed to the artwork (with Figma's
 * crop where the component crops) and saved as WebP. To add one: export the source image from Figma,
 * trim it, save it to ./images as WebP, add an entry here, and document it in docs/MASTER.md.
 */
import deliveryWithBox from './images/delivery-with-box.webp';
import deliveryRunning from './images/delivery-running.webp';
import deliveryBike from './images/delivery-bike.webp';
import deliveryStore from './images/delivery-store.webp';
import deliveryConcerned from './images/delivery-concerned.webp';
import deliveryBikeSide from './images/delivery-bike-side.webp';
import deliveryThumbsUp from './images/delivery-thumbs-up.webp';
import deliveryConfused from './images/delivery-confused.webp';
import doctorArmsFolded from './images/doctor-arms-folded.webp';
import doctorWithMeds from './images/doctor-with-meds.webp';
import doctorWithStethoscope from './images/doctor-with-stethoscope.webp';
import doctorInLab from './images/doctor-in-lab.webp';
import doctorWithPatient from './images/doctor-with-patient.webp';
import pharmacistWithCoupon from './images/pharmacist-with-coupon.webp';
import pharmacistVerifyingPrescription from './images/pharmacist-verifying-prescription.webp';
import pharmacistStandingWithMedicine from './images/pharmacist-standing-with-medicine.webp';
import pharmacistOnCall from './images/pharmacist-on-call.webp';
import phlebotomistThumbsUp from './images/phlebotomist-thumbs-up.webp';
import phlebotomistWithSyringe from './images/phlebotomist-with-syringe.webp';
import phlebotomistHomeVisitSenior from './images/phlebotomist-home-visit-senior.webp';
import phlebotomistHomeVisit from './images/phlebotomist-home-visit.webp';
import phlebotomistVaccination from './images/phlebotomist-vaccination.webp';

export type HoomanCharacter = 'delivery' | 'doctor' | 'pharmacist' | 'phlebotomist';

export interface HoomanDefinition {
  /** Image URL. */
  src: string;
  /** Character (Figma component set). */
  character: HoomanCharacter;
  /** Pose (Figma variant `pose=…`). */
  pose: string;
  /** Image width in px (sets the aspect ratio). */
  width: number;
  /** Image height in px. */
  height: number;
  /** What it depicts (Figma description, first sentence). */
  description: string;
  /** When to use it (Figma guidance). */
  usage: string;
  /** Figma node id. */
  figma: string;
}

export const hoomans = {
  'delivery-with-box': {
    src: deliveryWithBox,
    character: 'delivery',
    pose: 'with-box',
    width: 727,
    height: 1500,
    description: 'Smiling delivery partner standing and holding a sealed parcel with both hands.',
    usage: 'Use as supporting imagery for parcel handover, delivery arrival, receiving an order, pickup instructions, and delivery-service introductions. Pair with explicit copy to distinguish ready for pickup, arriving, and delivered states.',
    figma: '40002869:9457',
  },
  'delivery-running': {
    src: deliveryRunning,
    character: 'delivery',
    pose: 'running',
    width: 797,
    height: 1035,
    description: 'Delivery partner running while carrying a sealed parcel.',
    usage: 'Use as supporting imagery for express-delivery promotions, priority fulfillment, urgent order preparation, and energetic delivery-service onboarding. Treat the pose as a speed metaphor, not a promise of a specific delivery time; pair with accurate service or status text.',
    figma: '40002869:9459',
  },
  'delivery-bike': {
    src: deliveryBike,
    character: 'delivery',
    pose: 'bike',
    width: 888,
    height: 1228,
    description: 'Friendly delivery partner riding a scooter, shown from a three-quarter front view with a delivery carrier.',
    usage: 'Use as supporting imagery for order dispatched, out-for-delivery, delivery tracking, and delivery-service introductions. Pair with an explicit status or ETA; this pose does not indicate that an order has arrived.',
    figma: '40002869:9460',
  },
  'delivery-store': {
    src: deliveryStore,
    character: 'delivery',
    pose: 'store',
    width: 1050,
    height: 991,
    description: 'Smiling delivery partner behind a counter with sealed parcels, giving a thumbs-up.',
    usage: 'Use as supporting imagery for order packing completed, parcels ready for pickup, store fulfillment, and successful handover to the delivery team. Use the thumbs-up-only variant for general success messages without a packing or store context.',
    figma: '40002869:9461',
  },
  'delivery-concerned': {
    src: deliveryConcerned,
    character: 'delivery',
    pose: 'concerned',
    width: 687,
    height: 1464,
    description: 'Concerned delivery partner standing with hands on hips and a downturned expression.',
    usage: 'Use as supporting imagery for delivery delays, unsuccessful delivery attempts, service unavailability, and order issues that need attention. Pair with a clear explanation and a recovery action such as retrying, rescheduling, or contacting support; avoid using for success states.',
    figma: '40002869:9462',
  },
  'delivery-bike-side': {
    src: deliveryBikeSide,
    character: 'delivery',
    pose: 'bike-side',
    width: 938,
    height: 918,
    description: 'Side-profile delivery partner riding a scooter with a delivery carrier.',
    usage: 'Use as supporting imagery for in-transit orders, out-for-delivery updates, delivery journey banners, and tracking timelines. The horizontal silhouette suits wide layouts. Pair with explicit status text; do not use it alone to imply live location or a guaranteed arrival time.',
    figma: '40002869:9463',
  },
  'delivery-thumbs-up': {
    src: deliveryThumbsUp,
    character: 'delivery',
    pose: 'thumbs-up',
    width: 555,
    height: 1384,
    description: 'Smiling delivery partner standing and giving a thumbs-up.',
    usage: 'Use as supporting imagery for order confirmation, successful delivery, completed actions, and reassuring service messages. Pair with text identifying what succeeded; choose a parcel or counter variant when the message specifically concerns packing or handover.',
    figma: '40002869:9464',
  },
  'delivery-confused': {
    src: deliveryConfused,
    character: 'delivery',
    pose: 'confused',
    width: 1291,
    height: 1005,
    description: 'Delivery partner shrugging behind a counter beside an open, empty box.',
    usage: 'Use as supporting imagery for an empty cart, no orders yet, no matching products, or missing-item help. Pair with text that makes the exact state clear and offers a next step such as browsing products, clearing filters, or reporting an issue. Avoid using for an active delivery or success state.',
    figma: '40002869:9465',
  },
  'doctor-arms-folded': {
    src: doctorArmsFolded,
    character: 'doctor',
    pose: 'arms-folded',
    width: 494,
    height: 1385,
    description: 'Smiling doctor in a white coat and stethoscope, standing with arms folded.',
    usage: 'Use as supporting imagery for doctor-service introductions, healthcare onboarding, appointment entry points, and general care or reassurance messages. This is a generic illustrated character; do not present it as a real clinician profile, credential, or guarantee of outcomes.',
    figma: '40002872:9520',
  },
  'doctor-with-meds': {
    src: doctorWithMeds,
    character: 'doctor',
    pose: 'with-meds',
    width: 603,
    height: 1420,
    description: 'Doctor wearing a stethoscope and holding a medicine bottle.',
    usage: 'Use as supporting imagery for prescribed-treatment explanations, medication guidance, treatment-plan follow-ups, and consultation-led medicine information. Avoid using it as a product endorsement or to imply that a particular medicine is safe, effective, or appropriate for everyone.',
    figma: '40002872:9518',
  },
  'doctor-with-stethoscope': {
    src: doctorWithStethoscope,
    character: 'doctor',
    pose: 'with-stethoscope',
    width: 348,
    height: 767,
    description: 'Doctor in a white coat holding a stethoscope and clipboard.',
    usage: 'Use as supporting imagery for doctor consultations, routine checkups, appointment booking, preventive-care introductions, and general medical assessment. This is a general-care illustration, not evidence of a particular specialty, diagnosis, or treatment outcome.',
    figma: '40002872:9506',
  },
  'doctor-in-lab': {
    src: doctorInLab,
    character: 'doctor',
    pose: 'in-lab',
    width: 1754,
    height: 1418,
    description: 'White-coated healthcare character working with test tubes, a dropper, and a flask at a laboratory bench.',
    usage: 'Use as supporting imagery for diagnostic testing, laboratory services, sample analysis, and test-processing explanations. Although grouped with doctor poses, the scene depicts laboratory work rather than a consultation; do not use it to imply that results are ready or normal.',
    figma: '40002872:9508',
  },
  'doctor-with-patient': {
    src: doctorWithPatient,
    character: 'doctor',
    pose: 'with-patient',
    width: 1122,
    height: 1018,
    description: 'Doctor seated at a desk speaking with an adult woman during an in-person consultation.',
    usage: 'Use as supporting imagery for clinic appointments, discussing symptoms, care-plan explanations, report reviews, and patient guidance. Do not imply a specific diagnosis or specialty from the patient’s appearance; choose explicit copy to establish the consultation context.',
    figma: '40002872:9510',
  },
  'pharmacist-with-coupon': {
    src: pharmacistWithCoupon,
    character: 'pharmacist',
    pose: 'with-coupon',
    width: 1553,
    height: 1134,
    description: 'Pharmacist behind a checkout counter presenting a percentage-off coupon, beside a payment terminal and branded shopping bag.',
    usage: 'Use as supporting imagery for pharmacy offers, coupon discovery, medicine-order savings, and checkout promotions. Pair with the actual offer amount, eligibility, and terms; the image does not specify a discount value.',
    figma: '40002872:9549',
  },
  'pharmacist-verifying-prescription': {
    src: pharmacistVerifyingPrescription,
    character: 'pharmacist',
    pose: 'verifying-prescription',
    width: 1577,
    height: 1074,
    description: 'Pharmacist behind a counter reviewing a paper while holding a medicine bottle, with medicine packs, a branded bag, and a desk calendar.',
    usage: 'Use as supporting imagery for prescription verification, preparing a medicine order, refill assistance, and pharmacy dispensing information. The calendar is decorative; do not interpret its visible number as a delivery date or turnaround promise.',
    figma: '40002872:9547',
  },
  'pharmacist-standing-with-medicine': {
    src: pharmacistStandingWithMedicine,
    character: 'pharmacist',
    pose: 'standing-with-medicine',
    width: 659,
    height: 1387,
    description: 'Pharmacy character in a green checked shirt, reading a paper while holding a medicine bottle.',
    usage: 'Use as supporting imagery for prescription review, medicine information, refill reminders, and pharmacist-guided medicine selection. Pair with clear copy about the task; do not use the image alone to imply a medicine is approved or suitable for a particular patient.',
    figma: '40002872:9541',
  },
  'pharmacist-on-call': {
    src: pharmacistOnCall,
    character: 'pharmacist',
    pose: 'on-call',
    width: 1536,
    height: 1012,
    description: 'Pharmacist in a white coat speaking on a telephone behind a counter with a branded shopping bag.',
    usage: 'Use as supporting imagery for call-a-pharmacist services, medicine-order assistance, prescription clarification, callback requests, and pharmacy customer support. The scene represents a phone conversation, not a video consultation or delivery status.',
    figma: '40002872:9543',
  },
  'phlebotomist-thumbs-up': {
    src: phlebotomistThumbsUp,
    character: 'phlebotomist',
    pose: 'thumbs-up',
    width: 618,
    height: 1376,
    description: 'Smiling phlebotomist holding a clipboard and giving a thumbs-up.',
    usage: 'Use as supporting imagery for confirmed test bookings, completed sample collection, completed checklists, and reassuring next-step messages. Pair with explicit status text; do not imply normal test results or a clean bill of health from the gesture alone.',
    figma: '40002872:9571',
  },
  'phlebotomist-with-syringe': {
    src: phlebotomistWithSyringe,
    character: 'phlebotomist',
    pose: 'with-syringe',
    width: 649,
    height: 1313,
    description: 'Smiling phlebotomist standing and holding an upright syringe.',
    usage: 'Use as supporting imagery for phlebotomist introductions, sample-collection service overviews, and pre-visit information about trained collection staff. Prefer the patient-collection scenes for actual blood-test visits; do not treat the pose as a clinical instruction.',
    figma: '40002872:9569',
  },
  'phlebotomist-home-visit-senior': {
    src: phlebotomistHomeVisitSenior,
    character: 'phlebotomist',
    pose: 'home-visit-senior',
    width: 1351,
    height: 984,
    description: 'Phlebotomist collecting a blood sample from an older woman seated at home, with a medical collection bag nearby.',
    usage: 'Use as supporting imagery for at-home blood tests, senior-friendly sample collection, home-visit booking, and appointment preparation. Pair with clear service details; the illustration is not a procedural guide.',
    figma: '40002872:9565',
  },
  'phlebotomist-home-visit': {
    src: phlebotomistHomeVisit,
    character: 'phlebotomist',
    pose: 'home-visit',
    width: 1459,
    height: 951,
    description: 'Phlebotomist collecting a blood sample from a seated adult man at home, with a medical collection bag nearby.',
    usage: 'Use as supporting imagery for home sample collection, blood-test booking, collector-visit information, and what to expect at an appointment. Do not use as a step-by-step clinical instruction.',
    figma: '40002872:9567',
  },
  'phlebotomist-vaccination': {
    src: phlebotomistVaccination,
    character: 'phlebotomist',
    pose: 'vaccination',
    width: 1469,
    height: 1013,
    description: 'Gloved healthcare professional administering an injection into an adult patient’s upper arm.',
    usage: 'Use as supporting imagery for vaccination services, immunization booking, and injection-appointment information where the service is offered. This is an injection scene, not a blood-sample collection scene; avoid using it for blood tests or as a procedural guide.',
    figma: '40002872:9830',
  },
} satisfies Record<string, HoomanDefinition>;

export type HoomanName = keyof typeof hoomans;
export const hoomanNames = Object.keys(hoomans) as HoomanName[];
export const hoomanCharacters: HoomanCharacter[] = ['delivery', 'doctor', 'pharmacist', 'phlebotomist'];
