import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Pagination from '@mui/material/Pagination';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import InfoIcon from '@material-ui/icons/Info';
import PageHeader from "../../components/PageHeader";
import { makeStyles } from '@material-ui/core/styles';
import { green, red, grey, blue } from '@material-ui/core/colors';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import UploadFile from '@mui/icons-material/UploadFile';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Check from '@mui/icons-material/Check';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import { getBase64 } from '../../services/getFileService';
import { CSVDownloader } from 'react-papaparse'
import DownloadIcon from '@mui/icons-material/Download';
import Grid from '@material-ui/core/Grid'
import { getPermissions } from '../../services/userService';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
        '& .Mui-disabled': {
            color: "#2f2c33"
        }
    },
    color: {
        background: green["100"]
    },
    button: {
        margin: theme.spacing(1)
    },
    add: {
        backgroundColor: green[600]
    },
    remove: {
        backgroundColor: red[400]
    },
    edit: {
        backgroundColor: green[700]
    },
    save: {
        backgroundColor: blue[700]
    },
    buttonFixed: {
        position: "fixed"
    },
    image: {
        backgroundColor: grey.A100,
        "&:hover": {
            backgroundColor: blue[50]
        }
    },
    showImg: {
        backgroundColor: grey.A100,
        "&:hover": {
            backgroundColor: blue[50]
        }
    },
    removeImg: {
        backgroundColor: grey.A100,
        "&:hover": {
            backgroundColor: blue[50]
        },
        "&:disabled": {
            backgroundColor: blue[50]
        }
    },
    normal: {

    },
    inputEdit: {
        '& label.Mui-focused': {
            color: 'green',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'green',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'green',
                border: "2px solid"
            },
            '&:hover fieldset': {
                borderColor: 'grey',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'green',
            }
        }
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ViewData() {
    const { pid, bid } = useParams();
    const [factors, setFactors] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = React.useState(true);
    const classes = useStyles()
    const [inputFields, setInputFields] = useState([]);
    const [page, setPage] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [showCard, setShowCard] = useState(true);
    const [image, setImage] = useState("");
    const [cardPositionX, setCardPositionX] = useState(0);
    const [cardPositionY, setCardPositionY] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [recordId, setRecordId] = useState("");
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [inputEdit, setInputEdit] = useState({});
    const [toExport, setExport] = useState([]);
    const userType = localStorage.getItem("type");
    const [role, setRole] = useState(undefined);
    const editMessage = "¿Desea actualizar este registro?";
    const deleteMessage = "¿Desea eliminar este registro?";
    const editMessage_2 = "";
    const deleteMessage_2 = "Esta acción no es reversible";
    const editSuccess = "Se han actualizado los datos!"
    const deleteSuccess = "Se ha eliminado el registro!"
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    };

    function wrapValues(factors) {
        setFactors(factors);
        setLoading(false);
        setCount(1);
        setPage(1);
    }

    async function getAllFactors() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/factorproject/${bid}`,
                config
            );

            wrapValues(response.data.factors);


        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setOpen(false)
                    setError("");
                }, 2000);
            }, 5000);
            setOpen(true)
            return setError("Authentication failed!");
        }
    }

    async function getAllData() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/private/record/${bid}/${pid}`,
                config
            );

            let parse = parseData(response.data.records);
            setInputFields(parse);

            let con = parse.length;
            setCount(con % 3 === 0 ? parseInt(con / 3) : 1 + parseInt(con / 3));

        } catch (error) {
            setTimeout(() => {
                setTimeout(() => {
                    setOpen(false)
                    setError("");
                }, 2000);
            }, 5000);
            setOpen(true)
            return setError("Authentication failed!");
        }
    }

    const deleteRecord = async rid => {
        try {
            return await axios.delete(`${process.env.REACT_APP_API_URL}/api/private/record/${rid}`, config);
        } catch (error) {
            throw Error(error?.response?.data?.error);
        }
    }

    const getEditor = async _ => {
        return new Promise(resolve => {
            let element = {};
            element.timestamp = inputEdit.fecha + "T" + inputEdit.hora;
            element.values = {};

            const forEachLoop = async _ => {
                for (let index = 0; index < factors.length; index++) {
                    element.values[factors[index].name] = inputEdit[factors[index].name];
                }
            }
            forEachLoop().then(() => {
                resolve(element);
            }
            );
        })
    };



    const updateRecord = async _ => {
        let data = await getEditor();
        try {
            return await axios.patch(`${process.env.REACT_APP_API_URL}/api/private/record/${inputEdit.id}`, data, config);
        } catch (error) {
            throw Error(error?.response?.data?.error);
        }
    }

    useEffect(async () => {
        let unmounted = false;
        if(userType === "user"){
            const response = await getPermissions(localStorage.getItem("uid"), bid);
            setRole(response?.data?.role);
        }
        getAllFactors().then(getAllData());
        return () => { unmounted = true; };
    }, []);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const parseData = (records) => {
        let inputs = [];
        records.forEach(element => {
            let input = {};

            input.id = element.id;
            let date = element.timestamp.split("T");
            input.fecha = date[0];
            input.hora = date[1];

            for (let value in element.values[0]) {
                input[value] = element.values[0][value];
            }
            input.edit = false;
            inputs.push(input);
        });

        return inputs;
    }

    const openImage = () => {
        const base64ImageData = image;
        const contentType = image.match("data:(.+);")[1];

        const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, '_blank');
    }

    const prepareDelete = id => {
        setRecordId(id);
        setOpenDialog(true);
        setIsEdit(false);
    }

    const prepareEdit = input => {
        setInputEdit(input);
        setOpenDialog(true);
        setIsEdit(true);
    }

    const handleDelete = () => {

        deleteRecord(recordId).then(() => {
            setOpen(true);
            setOpenDialog(false);
            const values = [...inputFields];
            values.splice(values.findIndex(value => value.id === recordId), 1);
            setInputFields(values);

            let con = inputFields.length - 1;
            let result = con % 3 === 0 ? parseInt(con / 3) : 1 + parseInt(con / 3);
            if (result < count) {
                setCount(result);
                setPage(result);
            }
        }).catch(error => {
            setError(error)
            setOpen(true)
            setOpenDialog(false);
        });
    }

    const handleUpdate = () => {

        updateRecord().then(() => {
            setOpen(true);
            setOpenDialog(false);
            setInputEdit({});
            isEditing(inputEdit.id, false);
        }).catch(error => {
            setError(error)
            setOpen(true)
            setOpenDialog(false);
        });
    }

    const handleChangeInput = (id, event) => {
        const newInputFields = inputFields.map(i => {
            if (id === i.id) {
                i[event.target.name] = event.target.value
            }
            return i;
        })

        setInputFields(newInputFields);
    }

    const handleChangeImageInput = (id, event) => {
        let inputs = []
        const forEachLoop = async _ => {

            for (let index = 0; index < inputFields.length; index++) {
                if (id === inputFields[index].id) {

                    inputFields[index][event.target.name] = await getBase64(event.target.files[0]);
                }
                inputs.push(inputFields[index]);
            }
        }

        forEachLoop().then(() => {
            setInputFields(inputs);
        });
    }

    const isEditing = (id, edit) => {
        const newInputFields = inputFields.map(i => {
            if (id === i.id) {

                i["edit"] = edit;
            }
            return i;
        })
        setInputFields(newInputFields);
    }

    const removeImage = (id, factorName) => {
        const newInputFields = inputFields.map(i => {
            if (id === i.id) {

                i[factorName] = "";
            }
            return i;
        })
        setInputFields(newInputFields);
    }

    const displayCard = (isCard, id, factorName, event) => {
        setCardPositionX(event.clientX - 250);
        setCardPositionY(event.clientY - 600);
        let srcImage = ""


        if (isCard !== "") {

            inputFields.every(input => {

                if (input.id === id) {
                    srcImage = input[factorName];
                    return false;
                }
                return true;
            });
        }

        setShowCard(isCard);
        setImage(srcImage);
    }

    const closeDialog = () => {
        setOpenDialog(false);
        if (isEdit) {
            isEditing(inputEdit.id, false);
        }
    }

    return (
        <Container>
            <PageHeader
                title="Datos incluidos en el programa"
                subTitle="Se muestran todos los datos asociados a este programa y proyecto"
                icon={<InfoIcon fontSize="Large"
                />}
            />
            <div hidden={role? !role.export : false}>
                <Grid
                    container
                    direction="row"
                >
                    <Tooltip title="Exportar datos">
                        <div className={classes.iconContainer}>
                            <CSVDownloader
                                data={inputFields}
                                filename={'data'}
                                config={{}}
                            >
                                <DownloadIcon fontSize={'medium'} color={'success'} />
                            </CSVDownloader>
                        </div>
                    </Tooltip>
                </Grid>
            </div>
            <div className={classes.programholder} hidden={!loading}>
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: '0m',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>
                <br />
            </div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Pagination
                    sx={{ mt: 1 }}
                    size="large"
                    variant="outlined"
                    color="standard"
                    count={count}
                    siblingCount={0}
                    boundaryCount={2}
                    page={page}
                    onChange={handleChangePage}
                />
            </Box>
            <Collapse in={open}>
                <Alert
                    severity={error ? "error" : "success"}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error ? error : isEdit ? editSuccess : deleteSuccess}
                </Alert>
            </Collapse>
            <form className={classes.root}>
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{isEdit ? editMessage : deleteMessage}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {isEdit ? editMessage_2 : deleteMessage_2}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => closeDialog()} color={!isEdit ? "primary" : "secondary"}>
                            Cancelar
                        </Button>
                        <Button onClick={isEdit ? handleUpdate : handleDelete} color={isEdit ? "primary" : "secondary"}>
                            {isEdit ? "Actualizar" : "Eliminar"}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        ml: "5%"
                    }}
                >
                    <div>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Typography
                                sx={{
                                    m: "8px",
                                    py: "6px",
                                    px: "20px",
                                    width: "100%",
                                    borderRadius: 1
                                }}
                                hidden={factors.length === 0}
                                align="center"
                                variant="subtitle1"
                                component="div"
                                className={classes.color}>
                                Fecha
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Typography
                                sx={{
                                    m: "8px",
                                    py: "6px",
                                    px: "20px",
                                    width: "100%",
                                    borderRadius: 1
                                }}
                                hidden={factors.length === 0}
                                align="center"
                                variant="subtitle1"
                                component="div"
                                className={classes.color}>
                                Hora
                            </Typography>
                        </Box>
                        {factors.map(factor => (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Typography
                                    sx={{
                                        m: "8px",
                                        py: "6px",
                                        px: "20px",
                                        width: "100%",
                                        borderRadius: 1
                                    }}
                                    align="center"
                                    variant="subtitle1"
                                    component="div"
                                    className={classes.color}>
                                    {factor.name}
                                </Typography>
                            </Box>
                        ))}
                    </div>
                    {inputFields.map((inputField, index) => (
                        3 * page - index >= 1 && 3 * page - index <= 3 &&
                        <div key={inputField.id}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <TextField
                                    className={inputFields[index]["edit"] ? classes.inputEdit : classes.normal}
                                    disabled={!inputFields[index]["edit"]}
                                    style={{ width: "100%" }}
                                    type='date'
                                    name="fecha"
                                    value={inputField.fecha}
                                    variant="outlined"
                                    size="small"
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                />
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <TextField
                                    className={inputFields[index]["edit"] ? classes.inputEdit : classes.normal}
                                    disabled={!inputFields[index]["edit"]}
                                    style={{ width: "100%" }}
                                    type='time'
                                    name="hora"
                                    value={inputField.hora}
                                    size="small"
                                    variant="outlined"
                                    onChange={event => handleChangeInput(inputField.id, event)}
                                />
                            </Box>
                            {factors.map(factor => (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {factor.type === "value"
                                        ? <TextField
                                            className={inputFields[index]["edit"] ? classes.inputEdit : classes.normal}
                                            disabled={!inputFields[index]["edit"]}
                                            type='number'
                                            name={factor.name}
                                            value={inputField[factor.name]}
                                            label=""
                                            color="primary"
                                            size="small"
                                            variant="outlined"
                                            onChange={event => handleChangeInput(inputField.id, event)}
                                        />
                                        : inputFields[index][factor.name] === ""
                                            ? <Tooltip title="Subir imagen">
                                                <Button
                                                    style={{
                                                        margin: "8px",
                                                        width: "100%",
                                                        paddingTop: "8px",
                                                        paddingBottom: "8px",
                                                        paddingLeft: "20px",
                                                        paddingRight: "20px",
                                                    }}
                                                    disabled={!inputFields[index]["edit"]}
                                                    variant="contained"
                                                    component="label"
                                                    className={classes.image}
                                                >
                                                    <UploadFile />
                                                    <input
                                                        name={factor.name}
                                                        accept="image/*"
                                                        id="raised-button-file"
                                                        type="file"
                                                        hidden
                                                        onChange={event => handleChangeImageInput(inputField.id, event)}
                                                    />
                                                </Button>
                                            </Tooltip>
                                            : <>
                                                <Tooltip title="Abrir imagen">
                                                    <Button
                                                        style={{
                                                            margin: "8px",
                                                            width: inputFields[index]["edit"] ? "100%" : "75%",
                                                            paddingTop: "8px",
                                                            paddingBottom: "8px",
                                                            paddingLeft: "20px",
                                                            paddingRight: "20px",
                                                        }}
                                                        variant="contained"
                                                        onMouseEnter={(event) => displayCard(false, inputField.id, factor.name, event)}
                                                        onMouseLeave={(event) => displayCard(true, "", "", event)}
                                                        onClick={() => openImage()}
                                                        className={classes.showImg}
                                                    >
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                height: 25,
                                                                width: 25,
                                                                maxHeight: { xs: 25, md: 25 },
                                                                maxWidth: { xs: 25, md: 25 },
                                                            }}
                                                            alt=""
                                                            src={inputFields[index][factor.name]}
                                                        />
                                                    </Button>
                                                </Tooltip>
                                                {
                                                    inputFields[index]["edit"] &&
                                                    <Tooltip title="Remover imagen">
                                                        <Button
                                                            style={{
                                                                margin: "8px",
                                                                width: "25%",
                                                                paddingTop: "8px",
                                                                paddingBottom: "8px",
                                                                paddingLeft: "20px",
                                                                paddingRight: "20px",
                                                            }}
                                                            disabled={!inputFields[index]["edit"]}
                                                            variant="contained"
                                                            className={classes.removeImg}
                                                            onClick={() => removeImage(inputField.id, factor.name)}
                                                        >
                                                            <ClearIcon />
                                                        </Button>
                                                    </Tooltip>
                                                }
                                            </>
                                    }
                                </Box>
                            ))}
                            <div hidden={role?!role.editData:false}>
                                <Box
                                    sx={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>

                                    {!inputFields[index]["edit"]
                                        ? <Tooltip title="Editar registro">
                                            <IconButton onClick={() => isEditing(inputField.id, true)}>
                                                <Avatar className={classes.edit}>
                                                    <ModeEditIcon />
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                        : <Tooltip title="Guardar datos">
                                            <IconButton onClick={() => prepareEdit(inputField)}>
                                                <Avatar className={classes.save}>
                                                    <Check />
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    <Tooltip title="Eliminar registro">
                                        <IconButton onClick={() => prepareDelete(inputField.id)}>
                                            <Avatar className={classes.remove}>
                                                <DeleteIcon />
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </div>
                        </div>
                    ))}
                </Box>
            </form>
            <Card
                sx={{
                    maxWidth: 300,
                    maxHeight: 300,
                    position: "relative",
                    top: cardPositionY,
                    left: cardPositionX,
                }}
                hidden={showCard}
            >
                <CardMedia
                    component="img"
                    height="194"
                    image={image}
                    alt=""
                />
            </Card>
        </Container>
    );
}

export default ViewData;