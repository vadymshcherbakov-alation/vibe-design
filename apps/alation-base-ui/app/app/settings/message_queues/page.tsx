"use client";
import { SettingsSingleTablePage } from "../../../components/settings-single-table-page";
import { ColumnDef } from "@tanstack/react-table";

interface MessageQueue {
  topic: string;
  consumer: string;
  messagesProcessed: number;
}

const mockData: MessageQueue[] = [
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_273", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_274", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_3", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_430", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_433", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_436", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_437", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_438", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_491", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_494", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_496", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_497", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_498", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_499", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_504", messagesProcessed: 31957960 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_314", messagesProcessed: 13697669 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_1", messagesProcessed: 13897667 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_302", messagesProcessed: 13875333 },
  { topic: "rosemeta_attribute", consumer: "update_catalog_set_282", messagesProcessed: 12618622 },
];

const columns: ColumnDef<MessageQueue>[] = [
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "consumer",
    header: "Consumer",
  },
  {
    accessorKey: "messagesProcessed",
    header: "Messages Processed",
    cell: ({ row }) => row.original.messagesProcessed.toLocaleString(),
  },
];

export default function MessageQueuesPage() {
  return (
    <SettingsSingleTablePage
      pageTitle="Message Queues"
      breadcrumbs={[{ label: "Settings" }, { label: "Monitor" }]}
      tableTitle="Message Queue Progress"
      tableDescription="Monitor message queue consumers and processing status"
      columns={columns}
      data={mockData}
      searchPlaceholder="Search queues..."
      pageSize={25}
    />
  );
}
