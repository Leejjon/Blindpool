import React from "react";
import {makeStyles} from "@material-ui/styles";
import {useTranslation} from "react-i18next";
import {
    AppBar,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: '0.5em',
        marginRight: '0.3em',
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    icon: {
        color: '#00cc47',
        marginRight: 0,
    },
    linktext: {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: '0.13em',
    },
    logoImage: {
        width: "150px",
        height: "24px",
        marginTop: "0.4em",
    },
    linkWithoutDecoration: {
        textDecoration: 'none'
    },
    negativeLinkPadding: {
        //display: 'none'
        paddingRight: '0px',
        marginRight: '-0.5em'
    }
});

interface BpMenuProps {
    closeMenu: () => void
}

const BpMenu: React.FC<BpMenuProps> = ({closeMenu}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div className={classes.list}>
            <AppBar color="primary" position="static" onClick={closeMenu}>
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit"
                                aria-label="Navigation menu" aria-haspopup="true">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="body1" color="inherit" className={classes.grow}>
                        <img alt="BLINDPOOL" className={classes.logoImage}
                             src={require("../../images/logosmall.png")}/>
                    </Typography>
                </Toolbar>
            </AppBar>
            <List component="ul">
                <ListItem button component={Link} onClick={closeMenu} to="/create"
                          className={classes.linkWithoutDecoration}>
                    <ListItemIcon className={classes.negativeLinkPadding}>
                        <Icon className={classes.icon} fontSize="large">
                            add_circle
                        </Icon>
                    </ListItemIcon>
                    <ListItemText className={classes.linktext}>
                        {t("CREATE_POOL")}
                    </ListItemText>
                </ListItem>
                <ListItem button component={Link} onClick={closeMenu} to="/howto"
                          className={classes.linkWithoutDecoration}>
                    <ListItemIcon className={classes.negativeLinkPadding}>
                        <Icon fontSize="large">
                            help
                        </Icon>
                    </ListItemIcon>
                    <ListItemText className={classes.linktext}>
                        {t("HOW_TO_USE_BLINDPOOL_TITLE")}
                    </ListItemText>
                </ListItem>
            </List>
        </div>
    );
};

export default BpMenu;