import app from './app.js'
import connect from './config/dbConfig.js'

connect()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server listening at ${process.env.PORT}`)
    )
  })
  .catch((error) => console.log('DB connection failed: ', error))
