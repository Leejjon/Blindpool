import { Button, Card, CardActions, CardContent, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import BpComicStepper from "../components/bpcomicstepper/BpComicStepper";
import { Link, MetaFunction } from "@remix-run/react";
import BpSocialMediaLinks from "../components/bpsocialmedialinks/BpSocialMediaLinks";
import { getLocale, getPageTitle, resources } from "../locales/translations";

export const meta: MetaFunction = () => {
    return [
      { title: `${getPageTitle(resources[getLocale()].translation.HOW_DOES_IT_WORK_TITLE)}` },
      { name: "description", content: resources[getLocale()].translation.HOW_DOES_IT_WORK_DESCRIPTION },
    ];
  };

export default function HowTo() {
    const { t } = useTranslation();
    return (
        <Grid container justifyContent={"center"}  spacing={2}
              sx={{flexGrow: 1, textAlign: "center", marginTop: "0.5em", marginBottom: "1em"}}>
            <Grid key="definition" item>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2" >
                            {t("HOW_DOES_IT_WORK_TITLE")}
                        </Typography>
                        <Divider style={{margin: '0.5em'}} />
                        <BpComicStepper />
                    </CardContent>
                    <CardActions>
                        <Link className="lastButton" to="/create">
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", fontSize: "medium"}}>{t("CREATE_POOL")}</Button>
                        </Link>
                    </CardActions>
                </Card>
            </Grid>
            <BpSocialMediaLinks/>
        </Grid>
    );

}