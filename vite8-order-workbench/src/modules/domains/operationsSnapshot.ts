import { orderWorkflow } from './orders/workflow'
import { fulfillmentWorkflow } from './fulfillment/workflow'
import { inventoryWorkflow } from './inventory/workflow'
import { customerWorkflow } from './customers/workflow'
import { financeWorkflow } from './finance/workflow'
import { analyticsWorkflow } from './analytics/workflow'

export const todayTasks = [
  orderWorkflow.task,
  fulfillmentWorkflow.task,
  customerWorkflow.task,
  inventoryWorkflow.task,
  financeWorkflow.task,
  analyticsWorkflow.task,
]

export const latestActivities = [
  orderWorkflow.activity,
  fulfillmentWorkflow.activity,
  customerWorkflow.activity,
  financeWorkflow.activity,
  analyticsWorkflow.activity,
  inventoryWorkflow.activity,
]
