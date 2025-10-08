import {Table, TableCard} from "@/components/application/table/table";
import {Button} from "@/components/base/buttons/button";
import {Copy01, Edit01, PlusCircle, Trash01} from "@untitledui/icons";
import Link from "next/link";
import {Badge} from "@/components/base/badges/badges";
import {ButtonUtility} from "@/components/base/buttons/button-utility";

export default function DeliverablesTable() {
    return  <TableCard.Root className="mb-8">
        <TableCard.Header
            title={title}
            contentTrailing={
                <div className="flex items-center">
                    <Button
                        color="primary" size="sm" iconLeading={<PlusCircle data-icon />}
                        onClick={() => setOpenNewAssignmentsForm(true)}
                    >
                        Add assignment
                    </Button>
                </div>
            }
        />
        <Table aria-label="Assignments">
            <Table.Header>
                <Table.Head id="name" label="Name" isRowHeader/>
                <Table.Head id="type" label="File type" isRowHeader/>
                <Table.Head id="required" label="Required?" isRowHeader/>
            </Table.Header>

            <Table.Body items={assignments}>
                {(item) => (
                    <Table.Row id={item.id}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{item.type}</Table.Cell>
                        <Table.Cell>{item.description}</Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    </TableCard.Root>
    <>
        <h2>Add a deliverable</h2>

    </>
}