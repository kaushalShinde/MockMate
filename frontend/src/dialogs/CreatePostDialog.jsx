

import { Close as CloseIcon } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import React from 'react'
import CreatePost from '../components/specific/CreatePost';

const CreatePostDialog = (props) => {
    const { open, onClose } = props;
  return (
    <>
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogActions>
                <IconButton onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogActions>

            <DialogContent>
                <CreatePost />
            </DialogContent>
        </Dialog>
      
    </>
  )
}

export default CreatePostDialog
