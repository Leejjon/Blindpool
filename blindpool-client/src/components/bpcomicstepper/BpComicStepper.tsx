import React from "react";
import {Button, makeStyles, MobileStepper, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import {TFunction} from "i18next";
import {useTheme} from "@material-ui/core";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

const useStyles = makeStyles({
    root: {
        maxWidth: 400,
        flexGrow: 1,
        textAlign: "justify",
        textAlignLast: "center"
    },
    img: {
        height: 255,
        maxWidth: 400,
        overflow: 'hidden',
        display: 'block',
        width: '100%',
        paddingBottom: '0.5em'
    },
    backNextButtons: {
        backgroundColor: "#FAFAFA"
    },
    description: {
        lineHeight: '1.5em'
    }
});

const tutorialSteps = (t: TFunction) => {
    return [
        {label: t("COMIC1"), imgPath: require('../../images/comics/Blindpool_1.svg').default},
        {label: t("COMIC2"), imgPath: require('../../images/comics/Blindpool_2.svg').default},
        {label: t("COMIC3"), imgPath: require('../../images/comics/Blindpool_3.svg').default},
        {label: t("COMIC4"), imgPath: require('../../images/comics/Blindpool_4.svg').default},
        {label: t("COMIC5"), imgPath: require('../../images/comics/Blindpool_5.svg').default},
        {label: t("COMIC6"), imgPath: require('../../images/comics/Blindpool_6.svg').default},
    ];
};

const BpComicStepper: React.FC = () => {
    const classes = useStyles();
    const {t} = useTranslation();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = tutorialSteps(t).length;

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <div className={classes.root}>
            <SwipeableViews
                enableMouseEvents
                index={activeStep}
                onChangeIndex={handleStepChange}
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}>
                {
                    tutorialSteps(t).map((step, index) => {
                        return (<div key={step.label}>
                            {Math.abs(activeStep - index) <= 2 ? (
                                <img className={classes.img} src={step.imgPath} alt={step.label}/>
                            ) : null}
                        </div>);
                    })
                }
            </SwipeableViews>
            <MobileStepper
                className={classes.backNextButtons}
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                        {t("NEXT")}
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                        {t("BACK")}
                    </Button>
                }
            />
            <Typography className={classes.description}
                        variant="body1">{tutorialSteps(t)[activeStep].label}</Typography>
        </div>
    );
};

export default BpComicStepper;
