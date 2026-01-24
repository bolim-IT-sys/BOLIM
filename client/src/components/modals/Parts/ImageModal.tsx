import { useState } from "react";
import { Modal } from "../../Modal";
import { type Part } from "../../../services/Part.Service";
import SecondaryButton from "../../button/SecondaryButton";

interface EditingProps {
  part: Part;
}

export const ImageModal = ({ part }: EditingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);

  return (
    <>
      <div className="size-18 bg-neutral-200 flex justify-center items-center flex-col rounded">
        {!part.image ? (
          <>
            <i className="bx bx-image-landscape"></i>
            <h6>NO IMAGE</h6>
          </>
        ) : (
          <>
            <img
              className="h-full w-full object-cover cursor-pointer"
              src={`${import.meta.env.VITE_API_URL}/uploads/pinImage/${part.image}`}
              alt=""
              onClick={() => setModalShow(true)}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        size="md"
        title={
          <>
            <h3 className="text-start">{part.partNumber}</h3>
          </>
        }
        footer={
          <>
            <SecondaryButton text="CLOSE" onClick={() => setModalShow(false)} />
          </>
        }
      >
        <div className="size-60 sm:size-90 lg:size-130 rounded-xl mx-auto">
          <img
            className="h-full w-full object-contain"
            src={`${import.meta.env.VITE_API_URL}/uploads/pinImage/${part.image}`}
            alt=""
          />
        </div>
      </Modal>
    </>
  );
};
