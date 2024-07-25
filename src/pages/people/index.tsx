import { useState } from "react";
import Header from "@/components/Header";
import styles from "./styles.module.scss";
import { api } from "@/services/apiClient";

import { Input, Button, InputGroup, Notification, toaster } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";

const rsuiteStyles = {
    width: 450
}

export default function People() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false)

    async function handleRegisterPeople() {
        setLoading(true)

        if (!name) {
            toaster.push(
                <Notification type="warning" header="Aviso!">
                    Preencha o campo nome para cadastrar!
                </Notification>, { placement: 'topEnd', duration: 3500 }
            );

            setLoading(false)
            return;
        }

        try {
            const response = await api.post("/people", {
                name: name
            })

            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Pessoa cadastrada com sucesso!
                </Notification>, { placement: 'topEnd', duration: 3500 }
            )

            setLoading(false)
            setName('')
        } catch (error) {
            console.log(error)

            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao cadastrar pessoa!
                </Notification>, { placement: 'topEnd', duration: 3500 }
            )

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
                            <AvatarIcon />
                        </InputGroup.Addon>
                        <Input
                            value={name}
                            onChange={(e) => setName(e)}
                            placeholder="Digite um nome...."
                        />
                    </InputGroup>

                    <Button loading={loading} color="green" appearance="primary" onClick={handleRegisterPeople}>
                        Cadastrar
                    </Button>

                </div>
            </div>
        </>
    )
}