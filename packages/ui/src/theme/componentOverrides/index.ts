import { Components, Theme } from "@mui/material/styles";
import { accordionOverrides } from "./accordion";
import { alertOverrides } from "./alert";
import { avatarOverrides } from "./avatar";
import { backdropOverrides } from "./backdrop";
import { badgeOverrides } from "./badge";
import { breadcrumbsOverrides } from "./breadcrumbs";
import { buttonOverrides } from "./button";
import { buttonGroupOverrides } from "./buttonGroup";
import { cardOverrides } from "./card";
import { checkboxOverrides } from "./checkbox";
import { chipOverrides } from "./chip";
import { circularProgressOverrides } from "./circularProgress";
import { cssBaselineOverrides } from "./cssBaseline";
import { dialogOverrides } from "./dialog";
import { drawerOverrides } from "./drawer";
import { formHelperTextOverrides } from "./formHelperText";
import { iconButtonOverrides } from "./iconButton";
import { inputOverrides } from "./input";
import { inputLabelOverrides } from "./inputLabel";
import { linearProgressOverrides } from "./linearProgress";
import { linkOverrides } from "./link";
import { listOverrides } from "./list";
import { paperOverrides } from "./paper";
import { radioOverrides } from "./radio";
import { selectOverrides } from "./select";
import { skeletonOverrides } from "./skeleton";
import { snackbarOverrides } from "./snackbar";
import { svgIconOverrides } from "./svgIcon";
import { tableOverrides } from "./table";
import { tablePaginationOverrides } from "./tablePagination";
import { tabsOverrides } from "./tabs";
import { textFieldOverrides } from "./textField";
import { switchOverrides } from "./switch";
import { toggleButtonOverrides } from "./toggleButton";
import { tooltipOverrides } from "./tooltip";
import { typographyOverrides } from "./typography";

export const componentOverrides: Components<Theme> = {
  ...accordionOverrides,
  ...alertOverrides,
  ...avatarOverrides,
  ...backdropOverrides,
  ...badgeOverrides,
  ...breadcrumbsOverrides,
  ...buttonOverrides,
  ...buttonGroupOverrides,
  ...cardOverrides,
  ...checkboxOverrides,
  ...chipOverrides,
  ...circularProgressOverrides,
  ...cssBaselineOverrides,
  ...dialogOverrides,
  ...drawerOverrides,
  ...formHelperTextOverrides,
  ...iconButtonOverrides,
  ...inputOverrides,
  ...inputLabelOverrides,
  ...linearProgressOverrides,
  ...linkOverrides,
  ...selectOverrides,
  ...listOverrides,
  ...paperOverrides,
  ...radioOverrides,
  ...skeletonOverrides,
  ...snackbarOverrides,
  ...switchOverrides,
  ...svgIconOverrides,
  ...tableOverrides,
  ...tablePaginationOverrides,
  ...tabsOverrides,
  ...textFieldOverrides,
  ...toggleButtonOverrides,
  ...tooltipOverrides,
  ...typographyOverrides,
};
