import classes from "./PageNotFound.module.css"

const PageNotFound = () => {
    return <div className={classes.container}>
        <h1 className={classes.title}>404</h1>
        <h2>Page not found</h2>
        <h3>The page you requested could not be found</h3>
    </div>
}

export default PageNotFound