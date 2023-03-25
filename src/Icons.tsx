import { IconBrandGoogle } from "@tabler/icons-react";
import {
  Edit,
  Eye,
  Github,
  GripVertical,
  ImageIcon,
  LayoutTemplate,
  Link,
  LogOut,
  Menu,
  MessageCircle,
  MousePointerClick,
  Pencil,
  Plus,
  Save,
  Settings,
  Share2,
  Trash,
  UserPlus,
  Wand2,
} from "lucide-react";

export const icons = {
  Github: Github,
  Google: IconBrandGoogle,
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
  Click: MousePointerClick,
  Join: UserPlus,
  Testimonial: MessageCircle,
  CustomTheme: Wand2,
};

export function Icon(props: { size?: number; name: keyof typeof icons }) {
  const { size = 16, name } = props;
  const IconElement = icons[name];
  return <IconElement size={size} />;
}

import * as TablerIcons from "@tabler/icons-react";

export function SocialIcon(props: { name: string }) {
  const { name } = props;
  const iconsObj = TablerIcons as { [key: string]: any };
  const IconElement = iconsObj[name];
  return <IconElement />;
}
