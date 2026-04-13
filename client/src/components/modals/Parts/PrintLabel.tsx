import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Part = {
    serial_number: string;
    completed_date?: string;
    personnel?: string;
};

const PrintLabel: React.FC<{ parts: Part }> = ({ parts }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const canvas = document.getElementById("qr-code") as HTMLCanvasElement;

        if (!canvas) {
            alert("QR not found");
            return;
        }

        const imgData = canvas.toDataURL("image/png");

        const win = window.open("", "", "width=600,height=600");

        if (win) {
            win.document.write(`
      <html>
        <head>
          <title>QR Sticker</title>
          <style>
            @page {
              size: 2in 2in;
              margin: 0;
            }

            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            img {
              width: 1.8in;
              height: 1.8in;
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" />
        </body>
      </html>
    `);

            win.document.close();

            setTimeout(() => {
                win.print();
                win.close();
            }, 500);
        }
    };

    const qrCanvas = `Serial: ${parts.serial_number} Quantity: ${parts.completed_date} Outbound Date: ${parts.personnel}`

    return (
        <div>
            <div ref={printRef} className="hidden">
                <div className="title">Repair Outbound</div>
                {<QRCodeCanvas
                    id="qr-code"
                    value={qrCanvas}
                    size={200}
                />}
            </div>

            <button className="p-2 border rounded hover:bg-black hover:text-white w-full transition" onClick={handlePrint}>Print Label</button>
        </div>
    );
};

export default PrintLabel;