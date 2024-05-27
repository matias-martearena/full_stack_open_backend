export const errorHandler = (error, req, res, next) => {
  console.log(`Error: 
  ------ 
  ${error.message}
  ------`)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
