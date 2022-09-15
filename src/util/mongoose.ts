const mutipleMongooseToOject = function (mongooses: any) {
  return mongooses.map((mongoose: any) => mongoose.toOject() as object);
}

const mongooseToOject = function (mongoose: any) {
  return mongoose ? mongoose.toOject() : mongoose
}

export {
  mongooseToOject,
  mutipleMongooseToOject
}
