import {
  Edit,
  Eye,
  Facebook,
  Github,
  GripVertical,
  ImageIcon,
  LayoutTemplate,
  Link,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Save,
  Settings,
  Share2,
  Trash,
} from "lucide-react";

export const icons = {
  Github: Github,
  Google: Facebook,
  Share: Share2,
  Create: Pencil,
  Add: Plus,
  Thumbnail: ImageIcon,
  Delete: Trash,
  Edit: Edit,
  Save: Save,
  Drag: GripVertical,
  Preview: Eye,
  Link: Link,
  Appearance: LayoutTemplate,
  Settings: Settings,
  Logout: LogOut,
  Menu: Menu,
};

export function Icon(props: { size?: number; name: keyof typeof icons }) {
  const { size = 16, name } = props;
  const IconElement = icons[name];
  return <IconElement size={size} />;
}
