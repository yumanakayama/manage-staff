import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TenantSchema = new Schema({
  name: { // 必須
    type: String,
    required: true,
  },
  email: { // 必須
    type: String,
    required: true,
    unique: true,
  },
  password: { // 必須
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: true, // 初期値trueで登録
  },
  master: {
    type: Boolean,
    default: true, // 初期値trueで登録
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  lastCommentDate: {
    type: Date,
  }
})

// tenantIdに _id を割り当てるためのコード。
TenantSchema.pre('save', function (next) {
  if (!this.tenantId) {
    this.tenantId = this._id;
  }
  next()
})
export const TenantModel = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema)


const EmployeeSchema = new Schema({
  name: { // 必須
    type: String,
    required: true,
  },
  email: { // 必須
    type: String,
    required: true,
    unique: true,
  },
  password: { // 必須
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  tenantId: { // 必須
    type: String,
    required: true,
  },
  lastCommentDate: {
    type: Date,
  }
})
export const EmployeeModel = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema)


const ClientSchema = new Schema({
  name: { // 必須
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tenantId: { // 必須
    type: String,
    required: true,
  },
})
export const ClientModel = mongoose.models.Client || mongoose.model('Client', ClientSchema)


const ChatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})
export const ChatModel = mongoose.models.Chat || mongoose.model('Chat', ChatSchema)


const AssignSchema = new Schema({
  employee: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  since: {
    type: Date,
    required: true,
  },
  until: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  tenantId: {
    type: String,
    required: true,
  },
})
export const AssignModel = mongoose.models.Assign || mongoose.model('Assign', AssignSchema)
