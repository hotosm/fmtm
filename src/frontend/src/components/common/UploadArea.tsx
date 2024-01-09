import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommonActions } from '../../store/slices/CommonSlice';
import AssetModules from '../../shared/AssetModules.js';

type FileType = {
  name: string;
  url?: File;
  isDeleted: boolean;
};

const UploadArea = ({ title, label, acceptedInput, data, onUploadFile, multiple, filterKey }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);

  function isEmpty(obj) {
    if (Array.isArray(obj)) {
      return obj.length === 0;
    }
    return Object.keys(obj).length === 0;
  }

  const handleOpenFileExplorer = () => {
    fileInputRef?.current?.click();
  };
  useEffect(() => {
    setSelectedFiles(data);
  }, [data]);

  const changeHandler = (event) => {
    const { files } = event.target;
    const fileList = Object.values(files).map((item: any) => {
      const { name } = item;
      const file = item;
      //   const id = uuidv4();
      const isDeleted = false;
      return { name, [filterKey]: file, isDeleted };
    });
    if (multiple) {
      onUploadFile([...fileList, ...data]);
    } else {
      onUploadFile(fileList);
    }
  };
  const handleDeleteFile = (id) => {
    // const updatedList = data.filter((item) => item.id !== id);
    // fileInputRef?.current?.value = null;
    // return onUploadFile(updatedList);
  };
  console.log(selectedFiles, 'selectedFiles');

  return (
    <div>
      <p className="fmtm-text-[1rem] fmtm-mb-2 fmtm-font-semibold ">{title}</p>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        onClick={handleOpenFileExplorer}
        onDragEnter={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (!isEmpty(e.dataTransfer.files)) {
            const { files } = e.dataTransfer;
            const fileList: FileType[] = [];
            console.log(fileList, 'fileList');
            Object.values(files).map((item) => {
              const { name } = item;
              const file = item;
              const fileType = file.type.split('/')?.[1];
              if (acceptedInput === 'all') {
                const isDeleted = false;
                return fileList.push({ name, [filterKey]: file, isDeleted });
              }
              if (acceptedInput.includes(fileType)) {
                const isDeleted = false;
                return fileList.push({ name, [filterKey]: file, isDeleted });
              }
              dispatch(
                CommonActions.SetSnackBar({
                  open: true,
                  message: 'Invalid File Type.',
                  variant: 'error',
                  duration: 2000,
                }),
              );
              return null;
            });
            if (fileList.length > 0) {
              if (multiple) {
                onUploadFile([...fileList, ...data]);
              } else {
                onUploadFile([fileList.at(fileList.length - 1)]);
              }
            } else {
              onUploadFile(data);
            }
          }
        }}
        className="fmtm-cursor-pointer fmtm-border-[1px] fmtm-border-[#D8D8D8] fmtm-border-dashed fmtm-rounded-md fmtm-flex fmtm-flex-col fmtm-gap-2 fmtm-py-4"
      >
        <input
          className="fmtm-hidden"
          ref={fileInputRef}
          type="file"
          accept={acceptedInput === 'all' ? '' : acceptedInput}
          multiple={multiple}
          onChange={changeHandler}
        />
        <div className="fmtm-flex fmtm-justify-center">
          <AssetModules.CloudUploadOutlinedIcon style={{ fontSize: '32px' }} className="fmtm-text-primaryRed" />
        </div>
        <div className="fmtm-text-body-md fmtm-text-center fmtm-text-sm fmtm-text-[#757575] fmtm-font-archivo fmtm-font-semibold fmtm-tracking-wide">
          {label}
        </div>
      </div>
      {selectedFiles?.length > 0 && (
        <div className="fmtm-mb-10 fmtm-overflow-hidden fmtm-overflow-y-scroll scrollbar fmtm-h-fit fmtm-pb-5 ">
          {selectedFiles?.map((item, i) => (
            <div
              key={i}
              className="fmtm-px-3 fmtm-flex fmtm-items-center fmtm-relative fmtm-border-b-regular fmtm-border-border_color"
            >
              <div className="fmtm-h-10 fmtm-w-10 fmtm-rounded-full fmtm-bg-active_bg fmtm-border-regular fmtm-p-2 fmtm-mr-2 fmtm-border-border_color ">
                <i className="material-icons fmtm-text-active_text">description</i>
              </div>
              <div className="fmtm-py-3 fmtm-pr-2 fmtm-w-5/6">
                <div className="fmtm-text-button-1 fmtm-w-full fmtm-text-ellipsis">{item.name}</div>
              </div>
              <div className="fmtm-flex fmtm-absolute fmtm-right-3">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                  onClick={() => handleDeleteFile(i)}
                  className="fmtm-h-10 fmtm-w-10 fmtm-p-2"
                >
                  <i className="material-icons fmtm-text-[#FF4538]">delete</i>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadArea;
