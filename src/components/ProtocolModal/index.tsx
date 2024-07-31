import styles from "./styles.module.scss";
import { Input, InputGroup, DatePicker, SelectPicker, Stack, Toggle, Button, toaster, Notification, Table, Modal } from "rsuite";
import { useState } from "react";
import dayjs from "dayjs";
import { Document, People } from "./../../pages/index";

import { IoIosClose } from "react-icons/io";
import { api } from "@/services/apiClient";


export interface ProtocolProps {
    id: string;
    name: string;
    initial_date: string;
    final_date: string;
    partial_answer: boolean;
    right: boolean;
    people_id: string;
    document_id: string;
}

interface ModalProps {
    open: boolean,
    handleClose: () => void;
    protocol: ProtocolProps | null;
    documentList: Document[]
    peopleList: People[]
    updateRawList: () => void
}

export function ProtocolModal({ open, handleClose, protocol, documentList, peopleList, updateRawList }: ModalProps) {

    const [loading, setLoading] = useState<boolean>(false);

    const formattedInitialDate = dayjs(protocol?.initial_date).toDate()
    const formattedFinalDate = dayjs(protocol?.final_date).toDate()

    const [id, setId] = useState(protocol ? protocol.id : null)
    const [name, setName] = useState(protocol ? protocol.name : '')
    const [initialDate, setInitialDate] = useState<Date | null>(formattedInitialDate)
    const [finalDate, setFinalDate] = useState<Date | null>(formattedFinalDate)
    const [partialAnswer, setPartialAnswer] = useState(protocol ? protocol.partial_answer : false)
    const [rigth, setRight] = useState(protocol ? protocol.right : false)
    const [peopleId, setPeopleId] = useState(protocol ? protocol.people_id : null)
    const [documentId, setDocumentId] = useState(protocol ? protocol.document_id : null)

    const documentOptions = documentList.map(doc => ({ label: doc.name, value: doc.id }))
    const peopleOptions = peopleList.map(person => ({ label: person.name, value: person.id }))

    async function handleCalculateFinalDate(initialDate: Date | null) {
        if (initialDate) {
            const date = dayjs(initialDate)
            const finalDate = date.add(100, 'day').toDate()

            setFinalDate(finalDate)
        }
    }

    async function handleUpdateProtocol() {
        setLoading(true)
        try {
            if (!id || !name || !initialDate || !finalDate || !peopleId || !documentId) {
                toaster.push(
                    <Notification type="warning" header="Aviso!">
                        Peencha todas as informações para continuar!
                    </Notification>, { placement: "topEnd", duration: 3500 }
                )

                setLoading(false)
                return;
            }

            const response = await api.put("/protocol", {
                id: id,
                name: name,
                initial_date: initialDate,
                final_date: finalDate,
                partial_date: partialAnswer,
                right: rigth,
                people_id: peopleId,
                document_id: documentId
            })


            toaster.push(
                <Notification type="success" header="Sucesso!">
                    Protocolo atualizado com sucesso!
                </Notification>, { placement: "topEnd", duration: 3500 }
            )

            setLoading(false)

            updateRawList()
            
            handleClose()
        } catch (error) {
            toaster.push(
                <Notification type="error" header="Erro!">
                    Erro ao atualizar protocolo!
                </Notification>, { placement: "topEnd", duration: 3500 }
            )

            setLoading(false)
        }
    }

    return (
        <Modal
            size="lg"
            open={open}
            onClose={handleClose}
        >
            <Modal.Header closeButton={false}>
                <IoIosClose size={30} className={styles.closeModal} onClick={handleClose} />
            </Modal.Header>

            <Modal.Body>
                <div className={styles.containerForm}>

                    <Stack spacing={10} direction="row">
                        <InputGroup>
                            <Input
                                placeholder="N° do Protocolo"
                                style={{ width: 400 }}
                                value={name}
                                onChange={(e) => setName(e)}
                            />
                        </InputGroup>

                        <SelectPicker
                            data={documentOptions}
                            style={{ width: 250 }}
                            placeholder="Documentos"
                            value={documentId}
                            onChange={(value: string | null) => setDocumentId(value)}
                        />

                        <SelectPicker
                            data={peopleOptions}
                            style={{ width: 250 }}
                            placeholder="Resp. Pessoa"
                            value={peopleId}
                            onChange={(value: string | null) => setPeopleId(value)}
                        />
                    </Stack>

                    <Stack spacing={10} direction="row">
                        <DatePicker
                            format="dd/MM/yyyy"
                            placeholder="Data Inicial"
                            style={{ width: 250 }}
                            value={initialDate}
                            onChange={(date: Date | null) => {
                                setInitialDate(date)
                                handleCalculateFinalDate(date)
                            }}
                        />

                        <DatePicker
                            format="dd/MM/yyyy"
                            disabled
                            placeholder="Data Final"
                            style={{ width: 250 }}
                            value={finalDate}
                        />


                        <Toggle
                            checked={partialAnswer}
                            onChange={(checked: boolean) => setPartialAnswer(checked)}
                        >
                            Resp. Parcial
                        </Toggle>

                        <Toggle
                            checked={rigth}
                            onChange={(checked: boolean) => setRight(checked)}
                        >
                            Tudo OK
                        </Toggle>
                    </Stack>

                    <div className={styles.containerButton}>
                        <Button
                            loading={loading}
                            color="green"
                            appearance="primary"
                            onClick={handleUpdateProtocol}
                        >
                            Atualizar
                        </Button>
                    </div>
                </div>
            </Modal.Body>

        </Modal>
    )
}
