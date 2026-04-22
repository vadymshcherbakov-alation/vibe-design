import {Components, paperClasses, SvgIcon, Theme} from '@mui/material';
import {pickersArrowSwitcherClasses} from '@mui/x-date-pickers/internals';
import {pickersCalendarHeaderClasses, pickersDayClasses} from '@mui/x-date-pickers-pro';
import type {} from '@mui/x-date-pickers-pro/themeAugmentation';
import {Dayjs} from 'dayjs';

import {CalendarIcon, CaretDownSmallIcon, CaretLeftSmallIcon, CaretRightSmallIcon} from '@alation/icons-neo';

import {text} from './palettes/text';

export const muiDatePickerOverrides: Components<Theme> = {
  MuiDatePicker: {
    defaultProps: {
      slots: {
        openPickerIcon: (props) => <SvgIcon component={CalendarIcon} htmlColor={text.primary} {...props} />,
        switchViewIcon: (props) => (
          <SvgIcon component={CaretDownSmallIcon} fontSize='small' htmlColor={text.primary} {...props} />
        ),
        leftArrowIcon: (props) => (
          <SvgIcon component={CaretLeftSmallIcon} fontSize='small' htmlColor={text.primary} {...props} />
        ),
        rightArrowIcon: (props) => (
          <SvgIcon component={CaretRightSmallIcon} fontSize='small' htmlColor={text.primary} {...props} />
        ),
      },
      slotProps: {
        popper: {
          sx: {
            [`.${paperClasses.root}`]: {
              boxShadow: 2,
              [`.${pickersCalendarHeaderClasses.root}`]: {
                p: 0,
                justifyContent: 'center',
                mb: 1.25,
              },
              [`.${pickersCalendarHeaderClasses.labelContainer}`]: {
                position: 'absolute',
                right: '9.6rem',
                textAlign: 'center',
              },
              [`.${pickersCalendarHeaderClasses.label}`]: {
                display: 'flex',
                mr: 0.5,
                justifyContent: 'end',
              },
              [`.${pickersArrowSwitcherClasses.root}`]: {
                flex: 1,
                justifyContent: 'space-between',
                my: 0,
              },
              [`.${pickersArrowSwitcherClasses.button}`]: {
                mx: 2.25,
              },
            },
          },
        },
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      root: ({theme}) => ({
        marginTop: theme.spacing(2),
        maxHeight: '3rem',
        minHeight: '3rem',
      }),
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: ({theme}) => ({
        '&:hover': {
          backgroundColor: theme.palette.background.darken10,
        },
        [`&:focus.${pickersDayClasses.selected}`]: {
          backgroundColor: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiYearCalendar: {
    styleOverrides: {
      root: ({theme}) => ({
        padding: theme.spacing(0, 0, 0, 0.5),
        width: '30.8rem',
      }),
    },
  },
  MuiDateCalendar: {
    defaultProps: {
      dayOfWeekFormatter: (day: Dayjs) => day.format('dd'),
    },
    styleOverrides: {
      root: {
        width: '30.8rem',
        maxHeight: '31.2rem',
      },
    },
  },
  MuiDayCalendar: {
    styleOverrides: {
      slideTransition: {
        minHeight: '22.4rem',
      },
      weekDayLabel: {
        height: '3.2rem',
      },
      weekContainer: {
        margin: 0,
      },
    },
  },
  MuiPickersYear: {
    styleOverrides: {
      yearButton: ({theme}) => ({
        marginTop: 0,
        height: '5.2rem',
        borderRadius: theme.shape.borderRadius,
        ...theme.typography.subtitle2,
        '&:hover': {
          backgroundColor: theme.palette.background.darken10,
        },
      }),
    },
  },
};
