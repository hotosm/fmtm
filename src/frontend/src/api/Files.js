import { useEffect, useState } from 'react';
import CoreModules from '@/shared/CoreModules';

export const ProjectFilesById = (qrcode_base64, taskId) => {
  const [loading, setLoading] = useState(true);
  const [qrcode, setQrcode] = useState('');
  useEffect(() => {
    const fetchProjectFileById = async (qrcode_base64) => {
      try {
        setLoading(true);
        // TODO code to generate QR code

        // const json = JSON.stringify({
        //   token: xxx,
        //   var1: xxx,
        // });
        // Note btoa base64 encodes the JSON string
        // code.addData(btoa(json));
        // code.make();
        // Note cellSize=3
        // return code.createImgTag(3, 0);

        setQrcode(qrcode_base64);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProjectFileById(qrcode_base64);

    const cleanUp = () => {
      setLoading(false);
      setQrcode('');
    };

    return cleanUp;
  }, [taskId]);
  return { loading, qrcode };
};
