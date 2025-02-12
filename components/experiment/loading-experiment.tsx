import { Box, Card, CardContent, CircularProgress, Typography } from "@material-ui/core";
import useStyles from "./loading-experiment.style";
import Layout from "../layout/layout";

export default function LoadingExperiment() {
  const classes = useStyles()
  return <Layout>
            <Card className={classes.loadingContainer}>
                <CardContent>
                    <Box mt={8}>
                        <CircularProgress disableShrink className={classes.progress}/>
                        <Typography variant="body2">
                            Loading experiment...
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Layout>
}