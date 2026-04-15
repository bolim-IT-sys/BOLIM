import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Part = {
    serial_number: string;
    quantity?: string;
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
            <style>
              @page {
                size: 2in 2in;
                margin: 0;
              }

              body {
                margin: 0;
                font-family: Arial, sans-serif;
              }

              .label {
                width: 3in;
                height: 3in;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 6px;
                box-sizing: border-box;
              }

              .qr {
				padding: 0.5rem
			  }

              .qr img {
                width: 1.5in;
                height: 1.5in;
              }

              .info {
                font-size: 25px;
                line-height: 1.4;
                text-align: left;
              }

              .info strong {
                display: block;
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="qr">
                <img src="${imgData}" />
              </div>

              <div class="info">
                <strong>SN:</strong> ${parts.serial_number}
                <strong>Qty:</strong> ${parts.quantity}
              </div>
            </div>
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

    const qrCanvas = `Serial: ${parts.serial_number} Quantity: ${parts.quantity} Outbound Date: ${parts.personnel}`

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