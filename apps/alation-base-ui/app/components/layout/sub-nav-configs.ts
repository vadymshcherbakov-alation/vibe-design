import NavMcpIcon from "./assets/icon/nav-mcp.svg";
import AgentIcon from "./assets/icon/type-agent.svg";
import ToolIcon from "./assets/icon/type-tool.svg";
import ModelIcon from "./assets/icon/type-aimodel.svg";
import FlowIcon from "./assets/icon/type-flow.svg";
import UsageIcon from "./assets/icon/type-usage.svg";
import {
  SquareChevronRight,
  Store,
  Package,
  Settings2,
  CircleCheckBig,
  Bookmark,
  Lock,
  KeyRound,
  Users,
  CreditCard,
  UserCircle,
  TrendingUp,
  Database,
  PenTool,
  Plug,
  BookOpen,
  Origami,
  Layers,
  ListTodo,
  TriangleAlert,
  CheckCircle,
  GitBranch,
  BarChart3,
  MessageSquare,
  Globe,
  FileText,
  Mail,
  FileBarChart,
  Star,
  MapPin,
  Palette,
  FormInput,
  LockKeyhole,
  FileInput,
  Blocks,
  Puzzle,
  ToggleLeft,
  Home,
  Filter,
} from "lucide-react";
import type { SubNavConfig } from "./sub-nav";

export const agentStudioSubNav: SubNavConfig = {
  title: "Agent Studio",
  items: [
    { id: "agents", label: "Agents", icon: AgentIcon, href: "/app/studio/agents" },
    { id: "tools", label: "Tools", icon: ToolIcon, href: "/app/studio/tools" },
    { id: "mcp-servers", label: "MCP servers", icon: NavMcpIcon, href: "/app/studio/mcp-servers" },
    { id: "models", label: "Models", icon: ModelIcon, href: "/app/studio/models" },
    { id: "flows", label: "Flows", icon: FlowIcon, href: "/app/studio/flows" },
    { id: "usage", label: "Usage", icon: UsageIcon, href: "/app/studio/usage" },
    { id: "logs", label: "Logs", icon: SquareChevronRight, href: "/app/studio/logs", iconStyle: "stroke" },
    { id: "settings", label: "Settings", icon: Settings2, href: "/app/studio/settings", iconStyle: "stroke" },
  ],
};

/**
 * Default sub-nav configurations keyed by route prefix.
 * AlationLayout uses this to determine which sub-nav to render
 * based on the current pathname. Apps can override or extend
 * by passing their own `subNavConfigs` prop to AlationLayout.
 */
export const dataProductsSubNav: SubNavConfig = {
  title: "Data Products App",
  items: [
    { id: "demo-marketplace", label: "Demo Marketplace", icon: Store, href: "/app/marketplace", iconStyle: "stroke" },
    { id: "bookmarks", label: "My Bookmarks", icon: Bookmark, href: "/app/marketplace/bookmarks", iconStyle: "stroke" },
    { id: "auth", label: "Manage Authentication", icon: KeyRound, href: "/app/marketplace/auth", iconStyle: "stroke" },
    { id: "products", label: "My Data Products", icon: Package, href: "/app/marketplace/products", iconStyle: "stroke", dividerBefore: true },
    { id: "evaluations", label: "Central Evaluations", icon: CircleCheckBig, href: "/app/marketplace/evaluations", iconStyle: "stroke" },
    { id: "manage-marketplace", label: "Manage Marketplace", icon: Settings2, href: "/app/marketplace/manage-marketplace", iconStyle: "stroke", dividerBefore: true },
    { id: "manage-app", label: "Manage App", icon: Settings2, href: "/app/marketplace/manage-app", iconStyle: "stroke" },
  ],
};

export const adminSettingsSubNav: SubNavConfig = {
  title: "Admin Settings",
  sections: [
    {
      title: "User Management",
      items: [
        { id: "authentication", label: "Authentication", icon: Lock, href: "/app/settings/authentication", iconStyle: "stroke" },
        { id: "oauth_client_applications", label: "OAuth Client Applications", icon: Lock, href: "/app/settings/oauth_client_applications", iconStyle: "stroke" },
        { id: "encryption_key_rotation", label: "Encryption Key Rotation", icon: KeyRound, href: "/app/settings/encryption_key_rotation", iconStyle: "stroke" },
        { id: "groups", label: "Groups", icon: Users, href: "/app/settings/groups", iconStyle: "stroke" },
        { id: "licenses", label: "Licenses", icon: CreditCard, href: "/app/settings/licenses", iconStyle: "stroke" },
        { id: "users", label: "Users", icon: UserCircle, href: "/app/settings/users", iconStyle: "stroke" },
        { id: "user_profiles", label: "User Profiles", icon: UserCircle, href: "/app/settings/user_profiles", iconStyle: "stroke" },
      ],
    },
    {
      title: "Platform Settings",
      items: [
        { id: "alation_analytics_settings", label: "Alation Analytics Settings", icon: TrendingUp, href: "/app/settings/alation_analytics_settings", iconStyle: "stroke" },
        { id: "agents", label: "Agents", icon: Database, href: "/app/settings/agents", iconStyle: "stroke" },
        { id: "compose_settings", label: "Compose Settings", icon: PenTool, href: "/app/settings/compose_settings", iconStyle: "stroke" },
        { id: "connectors", label: "Connectors", icon: Plug, href: "/app/settings/connectors", iconStyle: "stroke" },
        { id: "lexicon_settings", label: "Lexicon Settings", icon: BookOpen, href: "/app/settings/lexicon_settings", iconStyle: "stroke" },
        { id: "lineage_settings", label: "Lineage Settings", icon: Layers, href: "/app/settings/lineage_settings", iconStyle: "stroke" },
        { id: "data_quality_settings", label: "Data Quality Settings", icon: Layers, href: "/app/settings/data_quality_settings", iconStyle: "stroke" },
      ],
    },
    {
      title: "System Monitor",
      items: [
        { id: "active_tasks", label: "Active Tasks", icon: ListTodo, href: "/app/settings/active_tasks", iconStyle: "stroke" },
        { id: "alerts", label: "Alerts", icon: TriangleAlert, href: "/app/settings/alerts", iconStyle: "stroke" },
        { id: "completed_tasks", label: "Completed Tasks", icon: CheckCircle, href: "/app/settings/completed_tasks", iconStyle: "stroke" },
        { id: "etl_status", label: "ETL Status", icon: GitBranch, href: "/app/settings/etl_status", iconStyle: "stroke" },
        { id: "logging", label: "Logging", icon: BarChart3, href: "/app/settings/logging", iconStyle: "stroke" },
        { id: "message_queues", label: "Message Queues", icon: MessageSquare, href: "/app/settings/message_queues", iconStyle: "stroke" },
        { id: "online_users", label: "Online Users", icon: Globe, href: "/app/settings/online_users", iconStyle: "stroke" },
        { id: "scheduled_query_dashboard", label: "Scheduled Query Dashboard", icon: FileText, href: "/app/settings/scheduled_query_dashboard", iconStyle: "stroke" },
      ],
    },
    {
      title: "System Administration",
      items: [
        { id: "email_server_settings", label: "Email Server Settings", icon: Mail, href: "/app/settings/email_server_settings", iconStyle: "stroke" },
        { id: "reporting", label: "Reporting", icon: FileBarChart, href: "/app/settings/reporting", iconStyle: "stroke" },
        { id: "miscellaneous", label: "Miscellaneous", icon: Star, href: "/app/settings/miscellaneous", iconStyle: "stroke" },
        { id: "ip_access_management", label: "IP Access Management", icon: MapPin, href: "/app/settings/ip_access_management", iconStyle: "stroke" },
      ],
    },
    {
      title: "Catalog Customization",
      items: [
        {
          id: "custom_templates",
          label: "Custom Templates",
          icon: Blocks,
          href: "/app/settings/custom_templates",
          iconStyle: "stroke",
        },
        {
          id: "custom_fields",
          label: "Custom Fields & Permissions",
          icon: FormInput,
          href: "/app/settings/custom_fields",
          iconStyle: "stroke",
        },
        {
          id: "custom_asset_types",
          label: "Custom Asset Types",
          icon: Origami,
          href: "/app/settings/custom_asset_types",
          iconStyle: "stroke",
        },
        {
          id: "homepage_customization",
          label: "Homepage Customization",
          icon: Home,
          href: "/app/settings/homepage_customization",
          iconStyle: "stroke",
        },
        {
          id: "search_filter_customization",
          label: "Search Filter Customization",
          icon: Filter,
          href: "/app/settings/search_filter_customization",
          iconStyle: "stroke",
        },
        {
          id: "branding_options",
          label: "Branding Options",
          icon: Palette,
          href: "/app/settings/branding_options",
          iconStyle: "stroke",
        },
        {
          id: "feature_configuration",
          label: "Feature Configuration",
          icon: ToggleLeft,
          href: "/app/settings/feature_configuration",
          iconStyle: "stroke",
        },
      ],
    },
  ],
};

export const defaultSubNavConfigs: Record<string, SubNavConfig> = {
  "/app/studio": agentStudioSubNav,
  "/app/marketplace": dataProductsSubNav,
  "/app/manage": dataProductsSubNav,
  "/app/settings": adminSettingsSubNav,
};
