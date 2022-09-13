import {Icon} from "./Icon";
import {Carousel, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useStore} from "../contexts/contexts";
import {formatFileSize, getFileName, getLink} from "../utils";
import styles from "./ImagesModal.module.css";

interface ImageFile {
  file: File,
  url: string,
  path: string,
  isPreview: boolean
}

export const ImagesModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const store = useStore();
  const {otherImages, previewImage} = store.form;
  const prefixDate = store.preferences.prefixDate;

  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    const files = [];
    if (previewImage && previewImage[0]) files.push({
      file: previewImage[0],
      url: getLink(previewImage[0]),
      path: getFileName(previewImage[0].name, prefixDate),
      isPreview: true
    });
    otherImages?.forEach((file) => {
      if (file) files.push({
        file: file,
        url: getLink(file),
        path: getFileName(file.name, prefixDate),
        isPreview: false
      });
    });
    setImages(files);
  }, [otherImages, previewImage]);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };


  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={true}
        dialogClassName={styles.dialogSize}
        centered={true}
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {images.length > 0 ? (
            <Carousel onSelect={handleSelect}>
              {images.map((file, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={file.url}
                    alt={file.path}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <p className="text-center pt-2">No images uploaded</p>
          )}
        </Modal.Body>
        {images.length > 0 && (
          <Modal.Footer className="d-block">
            {images[index] && (
              <ul className="dashed">
                <li>
                  Name: {images[index].file.name}
                  <code>{images[index].isPreview ? " [Preview Image]" : " [Other Image]"}</code>
                </li>
                <li>Path: {images[index].path}</li>
                <li>Size: {formatFileSize(images[index].file.size)}</li>
                <li>Type: {images[index].file.type}</li>
              </ul>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <Icon iconName="Images" size={24} onClick={handleShow}/>
    </>
  );
}
