import { app } from './app'
import { connectDb } from './mongo'

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`App is live at port ${port}`)
})

// uncomment when db needed in the future
// connectDb().then(() =>
// )
