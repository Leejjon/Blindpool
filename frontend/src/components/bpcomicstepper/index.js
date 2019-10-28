import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import intl from "react-intl-universal";
import SwipeableViews from 'react-swipeable-views';

const useStyles = makeStyles(theme => ({
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
        backgroundColor: "white"
    },
    description: {
        lineHeight: '1.5em'
    }
}));

const tutorialSteps = (intl) => {
    return [
        {label: intl.get("COMIC1"), imgPath: require('../../images/comics/blindpool1.png')},
        {label: intl.get("COMIC2"), imgPath: require('../../images/comics/blindpool2.png')},
        {label: intl.get("COMIC3"), imgPath: require('../../images/comics/blindpool3.png')},
        {label: intl.get("COMIC4"), imgPath: require('../../images/comics/blindpool4.png')},
        {label: intl.get("COMIC5"), imgPath: require('../../images/comics/blindpool5.png')},
        {label: intl.get("COMIC6"), imgPath: require('../../images/comics/blindpool6.png')},
    ];
};

export default (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = tutorialSteps(props.intl).length;

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = step => {
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
                    tutorialSteps(props.intl).map((step, index) => {
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
                        {intl.get("NEXT")}
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                        {intl.get("BACK")}
                    </Button>
                }
            />
            <Typography className={classes.description}
                        variant="p">{tutorialSteps(props.intl)[activeStep].label}</Typography>
        </div>
    );
};

