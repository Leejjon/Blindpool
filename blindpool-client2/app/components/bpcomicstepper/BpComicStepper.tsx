import React from "react";
import {Button, MobileStepper, Typography, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {type TFunction} from "i18next";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";

const buttonColor = {
    color: "rgba(0, 0, 0, 0.87)"
}

const tutorialSteps = (t: TFunction) => {
    return [
        {label: t("COMIC1"), imgPath: '/comics/Blindpool_1.svg'},
        {label: t("COMIC2"), imgPath: '/comics/Blindpool_2.svg'},
        {label: t("COMIC3"), imgPath: '/comics/Blindpool_3.svg'},
        {label: t("COMIC4"), imgPath: '/comics/Blindpool_4.svg'},
        {label: t("COMIC5"), imgPath: '/comics/Blindpool_5.svg'},
        {label: t("COMIC6"), imgPath: '/comics/Blindpool_6.svg'},
    ];
};

const BpComicStepper: React.FC = () => {
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

    return (
        <div>
            <img src={tutorialSteps(t)[activeStep].imgPath} alt={tutorialSteps(t)[activeStep].label} />
            <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} sx={buttonColor}>
                        {t("NEXT")}
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0} sx={buttonColor}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                        {t("BACK")}
                    </Button>
                }
                sx={{backgroundColor: "#FAFAFA"}}
            />
            <Typography variant="body1">{tutorialSteps(t)[activeStep].label}</Typography>
        </div>
    );
};

export default BpComicStepper;
