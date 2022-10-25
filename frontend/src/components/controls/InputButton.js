import { makeStyles } from "@material-ui/core";
import Button from "@mui/material/Button";


const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(0.5),
        textTransform: 'none'
    },
    label: {
        textTransform: 'none'
    },

    test: {
        textTransform: 'none',
        margin: theme.spacing(0.5),
    }
}))

export default function Button2(props) {

    const { text, size, color, variant, onClick, ...other } = props
    const classes = useStyles();

    return (
        <Button
            variant={variant || "contained"}
            size={size || "large"}
            color={color || "primary"}
            onClick={onClick}
            {...other}
            style={{margin:'auto', textTransform:'none', margin: '4px'}}
            >
            {text}
        </Button>
    )
}
