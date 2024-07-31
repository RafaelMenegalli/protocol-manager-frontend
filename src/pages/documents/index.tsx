import { useState } from "react";
import Header from "@/components/Header";
import styles from "./styles.module.scss";

import { Input, Button, InputGroup, Notification, toaster } from "rsuite";
import FileTextIcon from '@rsuite/icons/legacy/FileText';
import { api } from "@/services/apiClient";

const rsuiteStyles = {
    width: 450
}

export default function Document() {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleRegisterDocument() {
        setLoading(true)

        if (!name) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha as informações para cadastrar!
                </Notification>, { placement: 'topCenter', duration: 3500 }
            );

            setLoading(false)
            return;
        }

        try {
            const response = await api.post("/document", { name })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Documento cadastrado com sucesso!
                </Notification>, { placement: 'topCenter', duration: 3500 }
            );

            setLoading(false)
            setName('')
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro no cadastro de documento!
                </Notification>, { placement: 'topCenter', duration: 3500 }
            );

            setLoading(false)
        }
    }

    return (
        <>
            <Header></Header>

            <div className={styles.container}>

                <div className={styles.formContainer}>
                    <InputGroup style={rsuiteStyles}>
                        <InputGroup.Addon>
                            <FileTextIcon />
                        </InputGroup.Addon>
                        <Input
                            value={name}
                            onChange={(e) => setName(e)}
                            placeholder="Digite uma combinação de documentos..."
                        />
                    </InputGroup>

                    <Button loading={loading} color="green" appearance="primary" onClick={handleRegisterDocument}>
                        Cadastrar
                    </Button>

                </div>
            </div>
        </>
    )
}