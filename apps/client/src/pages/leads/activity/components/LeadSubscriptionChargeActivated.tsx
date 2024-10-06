import { ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import image from "@/assets/shopify-logo.svg"
import TimeAgo from 'timeago-react'
import DateHelper from '@/utils/DateHelper'
import LeadActivityBadge from './LeadActivityBadge'
const LeadSubscriptionChargeActivated = ({activity}:any) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const payload = {
      "shop": {
        "id": "gid://partners/Shop/71979237683",
        "myshopifyDomain": "sakthivel10.myshopify.com"
      },
      "type": "SUBSCRIPTION_CHARGE_ACTIVATED",
      "charge": {
        "id": "gid://shopify/AppSubscription/31146836275",
        "name": "Basic",
        "test": true,
        "amount": {
          "amount": "9.0",
          "currencyCode": "USD"
        },
        "billingOn": "2023-10-23"
      },
      "occurredAt": "2023-10-09T13:04:18.000000Z"
    }
  
    const formatDate = (dateString:string) => {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  
    return (
      <li className="mb-10 ms-6 hover:cursor-pointer">
         <span className="absolute  flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
          <img
            className="rounded-full shadow-lg"
            src={image}
            alt="Bonnie image"
            referrerPolicy="no-referrer"
          />
        </span>
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
          <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
            <TimeAgo
              datetime={DateHelper.convertToDateString(activity.createdAt)}
            />
          </time>
            <div className="flex-grow">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{payload.shop.myshopifyDomain}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                {/* <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                  {payload.type.split('_').join(' ')}
                </span> */}
                <LeadActivityBadge type={activity.data.payload.type} />

              </div>
              <div className="text-sm text-gray-500">
                Updated by System • {formatDate(payload.occurredAt)}
              </div>
            </div>
            <div className="flex-shrink-0 transition-transform duration-200 ease-in-out" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
        {
          isExpanded && (
            <div className="overflow-hidden hover:cursor-default mt-5 transition-all duration-500 ease-in-out" style={{ maxHeight: isExpanded ? '24rem' : '0px' }}>
              <div className="bg-gray-100  rounded-lg p-5">
                <h3 className="font-semibold mb-2">Subscription Details:</h3>
                <ul className="space-y-1 text-sm p-5">
                  <li><span className="font-medium">Plan:</span> {payload.charge.name}</li>
                  <li><span className="font-medium">Amount:</span> {payload.charge.amount.amount} {payload.charge.amount.currencyCode}</li>
                  <li><span className="font-medium">Billing Date:</span> {formatDate(payload.charge.billingOn)}</li>
                  <li><span className="font-medium">Charge ID:</span> {payload.charge.id.split('/').pop()}</li>
                  {payload.charge.test && (
                    <li className="text-yellow-600 font-semibold">Test Mode</li>
                  )}
                </ul>
              </div>
            </div>
          )
        }
      </li>
    )
}

export default LeadSubscriptionChargeActivated