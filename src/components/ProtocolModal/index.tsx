import styles from "./styles.module.scss";
import { Modal, ButtonToolbar, Button, Placeholder } from 'rsuite';

interface ModalProps {
    open: boolean,
    handleClose: () => void;
    handleUpdateProtocol: (id: string) => void;
}

export function ProtocolModal({ open, handleClose, handleUpdateProtocol }: ModalProps) {
    console.log()
    return (
        <Modal 
            size="lg"
            open={open}
            onClose={handleClose}
        >

        </Modal>
    )
}
