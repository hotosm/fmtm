import React, { useEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utilfunctions/shadcn';
import Searchbar from '@/components/common/SearchBar';
import { Command, CommandGroup, CommandItem } from '@/components/RadixComponents/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/RadixComponents/Popover';
import useDebouncedInput from '@/hooks/useDebouncedInput';
import AssetModules from '@/shared/AssetModules';

export interface selectPropType
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onFocus' | 'onAbort'> {
  options: selectOptionsType[];
  choose?: string;
  multiple?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  lengthOfOptions?: number;
  placeholderClassName?: string;
  checkBox?: boolean;
  style?: any;
  onFocus?: (e?: any) => void;
  onChange?: (e: any) => void;
  enableSearchbar?: boolean;
}
type selectOptionsType = {
  label: string;
  value: string | boolean | number;
  id?: string | number;
  code?: string;
  name?: string;
  [key: string]: any;
};

function Select2({
  options = [],
  multiple = false,
  choose = 'id',
  value,
  placeholder,
  onChange,
  onFocus,
  className,
  disabled,
  isLoading = false,
  placeholderClassName,
  lengthOfOptions = 0,
  style,
  checkBox = false,
  enableSearchbar = true,
}: selectPropType) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [filteredOptionsData, setFilteredOptionsData] = React.useState<any>([]);
  const [dropDownWidth, setDropDownWidth] = React.useState<number | undefined>(0);

  const handleSelect = (currentValue: any) => {
    if (onFocus) onFocus();

    if (multiple) {
      const selectedValues = Array.isArray(value) ? [...value] : [];
      const selectedIndex = selectedValues.indexOf(currentValue);
      if (selectedIndex === -1) {
        selectedValues.push(currentValue);
      } else {
        selectedValues.splice(selectedIndex, 1);
      }
      if (onChange) {
        // if there is limit of selection
        if (lengthOfOptions !== 0) {
          if (selectedValues.length > lengthOfOptions) {
            return;
          }
        }
        onChange(selectedValues);
      }
    } else {
      const selectedValue = currentValue === value ? '' : currentValue;
      if (onChange) {
        onChange(selectedValue);
      }
      setOpen(false);
    }
  };

  const [searchTextData, handleChangeData] = useDebouncedInput({
    ms: 400,
    init: searchText,
    onChange: (debouncedEvent) => setSearchText(debouncedEvent.target.value),
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setDropDownWidth(triggerRef.current?.clientWidth);
  }, [triggerRef.current?.clientWidth]);

  useEffect(() => {
    const filteredOptions = options?.filter((option) =>
      option?.label?.toLowerCase()?.includes(searchText?.trim()?.toLowerCase()),
    );
    setFilteredOptionsData(filteredOptions);
  }, [searchText]);

  useEffect(() => {
    setFilteredOptionsData(options);
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild ref={triggerRef}>
        <button
          disabled={disabled}
          className={cn(
            'fmtm-group fmtm-flex fmtm-items-center fmtm-justify-between fmtm-gap-2 fmtm-border-[1px] fmtm-border-gray-300 fmtm-h-[2.3rem] fmtm-rounded-md disabled:!fmtm-cursor-not-allowed fmtm-px-3',
            className,
          )}
          onClick={() => setOpen(true)}
        >
          <div className="fmtm-flex fmtm-items-center fmtm-justify-center fmtm-gap-2">
            {multiple ? (
              <div className="fmtm-flex fmtm-flex-wrap">
                {Array.isArray(value) && value.length > 0 ? (
                  value.length === 1 ? (
                    <span className="fmtm-body-sm fmtm-line-clamp-1 fmtm-text-start">
                      {options?.find((option) => option[choose as keyof selectOptionsType] === value[0])?.label ||
                        '1 Selected'}
                    </span>
                  ) : (
                    <span className="fmtm-line-clamp-1 fmtm-text-start fmtm-font-medium">{value.length} Selected</span>
                  )
                ) : (
                  <p
                    className={cn(
                      'fmtm-text-base fmtm-line-clamp-1  fmtm-text-start fmtm-text-grey-500',
                      placeholderClassName,
                    )}
                  >
                    {placeholder || 'Choose'}
                  </p>
                )}
              </div>
            ) : (
              <>
                {value ? (
                  <p className="fmtm-text-base fmtm-line-clamp-1 fmtm-text-start">
                    {options.find((option) => {
                      return option[choose as keyof selectOptionsType] === value;
                    })?.label || 'No Name Found'}
                  </p>
                ) : (
                  <p
                    className={cn(
                      'fmtm-text-base fmtm-line-clamp-1 fmtm-text-start fmtm-text-grey-500',
                      placeholderClassName,
                    )}
                  >
                    {placeholder || 'Choose'}
                  </p>
                )}
              </>
            )}
          </div>
          <AssetModules.ExpandMoreIcon className="fmtm-text-grey-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="fmtm-bg-white fmtm-p-[0px]" style={{ width: `${dropDownWidth}px`, ...style }}>
        {enableSearchbar ? (
          <Searchbar
            value={searchTextData}
            onChange={handleChangeData}
            isSmall
            className=" !fmtm-py-3 fmtm-border-t-0 fmtm-border-x-0 fmtm-rounded-b-none focus:!fmtm-border-grey-300"
            wrapperStyle="!fmtm-h-auto"
          />
        ) : null}
        <div className="scrollbar search-scrollbar fmtm-block fmtm-max-h-[10rem] fmtm-overflow-y-auto">
          <Command className="fmtm-m-0 fmtm-p-0">
            {isLoading && (
              <div className="fmtm-flex fmtm-items-center fmtm-gap-2 fmtm-px-4 fmtm-py-2">
                <LoaderCircle className="fmtm-w-5 fmtm-animate-spin" /> <p>Loading ...</p>
              </div>
            )}
            <CommandGroup className="">
              {filteredOptionsData.length ? (
                filteredOptionsData?.map((option) => (
                  <CommandItem
                    key={option.value?.toString()}
                    onSelect={() => {
                      handleSelect(option[choose as keyof selectPropType]);
                    }}
                    className="fmtm-flex fmtm-items-center fmtm-gap-[0.15rem] hover:fmtm-bg-red-50 fmtm-duration-150"
                  >
                    {!checkBox ? (
                      <AssetModules.DoneIcon
                        className={`!fmtm-text-[20px] fmtm-text-grey-600 ${
                          !multiple
                            ? value === option[choose as keyof selectPropType]
                              ? 'fmtm-opacity-100'
                              : 'fmtm-opacity-0'
                            : Array.isArray(value) && value.includes(option[choose as keyof selectPropType])
                              ? 'fmtm-opacity-100'
                              : 'fmtm-opacity-0'
                        }`}
                      />
                    ) : !multiple ? (
                      value === option[choose as keyof selectPropType] ? (
                        <AssetModules.CheckBoxIcon className="!fmtm-text-[20px] fmtm-text-grey-600" />
                      ) : (
                        <AssetModules.CheckBoxOutlineBlankIcon className="!fmtm-text-[20px] fmtm-text-grey-600" />
                      )
                    ) : Array.isArray(value) && value.includes(option[choose as keyof selectPropType]) ? (
                      <AssetModules.CheckBoxIcon className="!fmtm-text-[20px] fmtm-text-grey-600" />
                    ) : (
                      <AssetModules.CheckBoxOutlineBlankIcon className="!fmtm-text-[20px] fmtm-text-grey-600" />
                    )}
                    <span className="fmtm-text-base fmtm-text-grey-800">{option.label || '-'}</span>
                  </CommandItem>
                ))
              ) : (
                <div className="fmtm-body-sm fmtm-line-clamp-1 fmtm-flex fmtm-h-[4.25rem] fmtm-items-center fmtm-justify-center fmtm-text-start">
                  No Data Found.
                </div>
              )}
            </CommandGroup>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Select2;
