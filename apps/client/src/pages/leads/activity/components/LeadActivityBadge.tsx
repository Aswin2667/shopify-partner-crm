enum LeadActivityType {
  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_UPDATED = 'LEAD_UPDATED',
  NOTE_CREATED = 'NOTE_CREATED',
  NOTE_UPDATED = 'NOTE_UPDATED',
  NOTE_DELETED = 'NOTE_DELETED',
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  TASK = 'TASK',
  MEETING = 'MEETING',
  STATUS_CHANGE = 'STATUS_CHANGE',
  RELATIONSHIP_INSTALLED = 'RELATIONSHIP_INSTALLED',
  RELATIONSHIP_UNINSTALLED = 'RELATIONSHIP_UNINSTALLED',
  CREDIT_APPLIED = 'CREDIT_APPLIED',
  CREDIT_FAILED = 'CREDIT_FAILED',
  CREDIT_PENDING = 'CREDIT_PENDING',
  ONE_TIME_CHARGE_ACCEPTED = 'ONE_TIME_CHARGE_ACCEPTED',
  ONE_TIME_CHARGE_ACTIVATED = 'ONE_TIME_CHARGE_ACTIVATED',
  ONE_TIME_CHARGE_DECLINED = 'ONE_TIME_CHARGE_DECLINED',
  ONE_TIME_CHARGE_EXPIRED = 'ONE_TIME_CHARGE_EXPIRED',
  RELATIONSHIP_REACTIVATED = 'RELATIONSHIP_REACTIVATED',
  RELATIONSHIP_DEACTIVATED = 'RELATIONSHIP_DEACTIVATED',
  SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT = 'SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT',
  SUBSCRIPTION_CAPPED_AMOUNT_UPDATED = 'SUBSCRIPTION_CAPPED_AMOUNT_UPDATED',
  SUBSCRIPTION_CHARGE_ACCEPTED = 'SUBSCRIPTION_CHARGE_ACCEPTED',
  SUBSCRIPTION_CHARGE_ACTIVATED = 'SUBSCRIPTION_CHARGE_ACTIVATED',
  SUBSCRIPTION_CHARGE_CANCELED = 'SUBSCRIPTION_CHARGE_CANCELED',
  SUBSCRIPTION_CHARGE_DECLINED = 'SUBSCRIPTION_CHARGE_DECLINED',
  SUBSCRIPTION_CHARGE_EXPIRED = 'SUBSCRIPTION_CHARGE_EXPIRED',
  SUBSCRIPTION_CHARGE_FROZEN = 'SUBSCRIPTION_CHARGE_FROZEN',
  SUBSCRIPTION_CHARGE_UNFROZEN = 'SUBSCRIPTION_CHARGE_UNFROZEN'
}

const badgeColors: { [key in LeadActivityType]: string } = {
  [LeadActivityType.LEAD_CREATED]: 'bg-green-100 text-green-800',
  [LeadActivityType.LEAD_UPDATED]: 'bg-blue-100 text-blue-800',
  [LeadActivityType.NOTE_CREATED]: 'bg-yellow-100 text-yellow-800',
  [LeadActivityType.NOTE_UPDATED]: 'bg-orange-100 text-orange-800',
  [LeadActivityType.NOTE_DELETED]: 'bg-red-100 text-red-800',
  [LeadActivityType.EMAIL]: 'bg-indigo-100 text-indigo-800',
  [LeadActivityType.CALL]: 'bg-purple-100 text-purple-800',
  [LeadActivityType.TASK]: 'bg-pink-100 text-pink-800',
  [LeadActivityType.MEETING]: 'bg-teal-100 text-teal-800',
  [LeadActivityType.STATUS_CHANGE]: 'bg-cyan-100 text-cyan-800',
  [LeadActivityType.RELATIONSHIP_INSTALLED]: 'bg-green-300 text-green-900',
  [LeadActivityType.RELATIONSHIP_UNINSTALLED]: 'bg-rose-100 text-rose-800',
  [LeadActivityType.CREDIT_APPLIED]: 'bg-emerald-100 text-emerald-800',
  [LeadActivityType.CREDIT_FAILED]: 'bg-red-200 text-red-900',
  [LeadActivityType.CREDIT_PENDING]: 'bg-amber-100 text-amber-800',
  [LeadActivityType.ONE_TIME_CHARGE_ACCEPTED]: 'bg-green-200 text-green-900',
  [LeadActivityType.ONE_TIME_CHARGE_ACTIVATED]: 'bg-blue-200 text-blue-900',
  [LeadActivityType.ONE_TIME_CHARGE_DECLINED]: 'bg-red-300 text-red-900',
  [LeadActivityType.ONE_TIME_CHARGE_EXPIRED]: 'bg-gray-200 text-gray-800',
  [LeadActivityType.RELATIONSHIP_REACTIVATED]: 'bg-lime-300 text-lime-800',
  [LeadActivityType.RELATIONSHIP_DEACTIVATED]: 'bg-orange-200 text-orange-900',
  [LeadActivityType.SUBSCRIPTION_APPROACHING_CAPPED_AMOUNT]: 'bg-yellow-200 text-yellow-900',
  [LeadActivityType.SUBSCRIPTION_CAPPED_AMOUNT_UPDATED]: 'bg-blue-300 text-blue-900',
  [LeadActivityType.SUBSCRIPTION_CHARGE_ACCEPTED]: 'bg-green-400 text-green-900',
  [LeadActivityType.SUBSCRIPTION_CHARGE_ACTIVATED]: 'bg-blue-200 text-blue-900',
  [LeadActivityType.SUBSCRIPTION_CHARGE_CANCELED]: 'bg-red-400 text-red-900',
  [LeadActivityType.SUBSCRIPTION_CHARGE_DECLINED]: 'bg-orange-300 text-orange-900',
  [LeadActivityType.SUBSCRIPTION_CHARGE_EXPIRED]: 'bg-gray-300 text-gray-900',
  [LeadActivityType.SUBSCRIPTION_CHARGE_FROZEN]: 'bg-cyan-200 text-cyan-900',
  [LeadActivityType.SUBSCRIPTION_CHARGE_UNFROZEN]: 'bg-cyan-300 text-cyan-900'
}

interface LeadActivityBadgeProps {
  type: LeadActivityType
}




export default function LeadActivityBadge({ type }: LeadActivityBadgeProps) {
  const badgeColor = badgeColors[type]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
      {String(type).split('_').join(' ')}
    </span>
  )
}
