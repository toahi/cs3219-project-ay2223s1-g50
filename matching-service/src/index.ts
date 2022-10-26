import { app } from './app'

const port = 5004;

app.listen(port, () => {
  console.log(`App is live at port ${port}`)
})
