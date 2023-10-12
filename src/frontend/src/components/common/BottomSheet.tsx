import React, { useEffect, useRef, useState } from 'react';

const BottomSheet = ({ body, onClose }) => {
  const sheetContentRef: any = useRef(null);
  const bottomSheetRef: any = useRef(null);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [currSheetHeight, setCurrSheetHeight] = useState(0);

  useEffect(() => {
    bottomSheetRef.current.classList.add('show');
    document.body.style.overflowY = 'hidden';
    bottomSheetRef.current.style.height = `51vh`;
    updateSheetHeight(50);
  }, []);

  const updateSheetHeight = (height) => {
    if (sheetContentRef.current) {
      sheetContentRef.current.style.height = `${height}vh`;
    }
    bottomSheetRef.current.classList.toggle('fullscreen', height === 100);
  };

  const hideBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.classList.remove('show');
    }
    onClose();
    document.body.style.overflowY = 'auto';
  };

  const dragStart = (e) => {
    const pagesY = e.pageY || e.changedTouches[0].screenY;
    setStartY(pagesY);
    if (sheetContentRef.current) {
      setStartHeight(parseInt(sheetContentRef.current.style.height));
    }
    if (bottomSheetRef.current) {
      bottomSheetRef.current.classList.add('dragging');
    }
  };

  const dragging = (e) => {
    const delta = startY - (e.pageY || e.changedTouches[0].screenY);
    const newHeight = startHeight + (delta / window.innerHeight) * 100;
    bottomSheetRef.current.style.height = `100vh`;
    updateSheetHeight(newHeight);
  };

  const dragStop = () => {
    let sheetHeight;
    bottomSheetRef.current.style.height = `${currSheetHeight + 1}vh`;

    if (bottomSheetRef.current) {
      bottomSheetRef.current.classList.remove('dragging');
    }
    if (sheetContentRef.current) {
      sheetHeight = parseInt(sheetContentRef.current.style.height);
      setCurrSheetHeight(sheetHeight);
    }
    sheetHeight < 25 ? hideBottomSheet() : sheetHeight > 75 ? updateSheetHeight(100) : updateSheetHeight(50);
  };

  useEffect(() => {
    dragStop();
  }, [currSheetHeight]);

  return (
    <div className="fmtm-absolute fmtm-bottom-[400px] fmtm-bg-white sm:fmtm-hidden">
      <div className="bottom-sheet" ref={bottomSheetRef}>
        <div ref={sheetContentRef} className="content fmtm-shadow-[30px_-10px_40px_25px_rgba(0,0,0,0.2)]">
          <div className="header">
            <div
              className="drag-icon"
              onMouseDown={dragStart}
              onTouchStart={dragStart}
              onMouseMove={dragging}
              onTouchMove={dragging}
              onMouseUp={dragStop}
              onTouchEnd={dragStop}
            >
              <span></span>
            </div>
          </div>
          <div className="body fmtm-overflow-y-scroll scrollbar">{body}</div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
