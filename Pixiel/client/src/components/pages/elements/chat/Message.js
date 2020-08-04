import React from 'react';
import ReactEmoji from 'react-emoji';

//Material-UI
import Box from '@material-ui/core/Box';
import {makeStyles} from "@material-ui/core/styles";



const useStyles = makeStyles((theme) => ({
    root: {
        fontFamily: "Nishuki Pixels"
    },
    messageBox1: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.contrastText,
    },
    messageBox2: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    }
}));


const Message = ({ message: { user, text, time }, nickName }) => {

    const classes = useStyles();

    let isSentByCurrentUser = false;
    const trimmedNickName = nickName.trim().toLowerCase();

    if(user === trimmedNickName) {
        isSentByCurrentUser = true;
    }

    return (
        isSentByCurrentUser ? (
                <>
                    {/*Messaggio mandato da un utente corrente*/}
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        py={0}
                        px="5%"
                        mt={3}
                        className={classes.root}
                    >
                        <Box
                            display="inline-block"
                            className={classes.messageBox1}
                            maxWidth="80%"
                            py="5px"
                            px="20px"
                        >
                            <Box width="100%"><p>{ReactEmoji.emojify(text)}</p></Box>
                        </Box>

                        <Box
                            display="flex"
                            alignItems="center"
                            pl="10px">
                            <p>{trimmedNickName} {time}</p>
                        </Box>
                    </Box>
                </>
            )
            : (
                <>
                    {/*Messaggi inviato dall'admin*/}
                    <Box
                        display="flex"
                        justifyContent="flex-start"
                        mt={3}
                        className={classes.root}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            pr="10px">
                            <p>{user} {time}</p>
                        </Box>
                        <Box
                            display="inline-block"
                            className={classes.messageBox2}
                            maxWidth="80%"
                            py="5px"
                            px="20px"
                        >
                            <Box width="100%"><p>{ReactEmoji.emojify(text)}</p></Box>
                        </Box>
                    </Box>
                </>
            )
    )
}

export default Message;