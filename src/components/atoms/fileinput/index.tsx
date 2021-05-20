import React from 'react';
import { hot } from 'react-hot-loader/root';
import { mapModifiers } from 'lib/component';
import { Text } from 'components/atoms/text';
import { Button } from 'components/atoms/button';
import { useDropzone } from 'react-dropzone';
import { useFormikContext } from 'formik';
import { Image } from 'components/atoms/image';

import cloud from 'assets/images/icon/icon-cloud.svg';

type Modifier = 'foo' | 'bar';

interface Props {
  modifiers?: Modifier | Modifier[];
  name: string;
  label: string;
  setTouched?: () => void;
}

export const FileInput: React.FC<Props> = props => {
  const { setFieldValue, setErrors, errors } = useFormikContext();
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: '.png, .gif, .webp, .mp4, .mp3',
    noClick: true,
    noKeyboard: true,
    maxSize: 50 * 1024 * 1024,
    onDrop: acceptedFiles => {
      props.setTouched && props.setTouched();
      acceptedFiles.length && setFieldValue(props.name, acceptedFiles[0]);
    },
    onDropRejected: fileRejections => {
      const errorMessage =
        fileRejections[0]?.errors[0]?.message.replace(/ \d+ /, ' 50 ').replace(' bytes', 'mb') ||
        'Invalid File Format.';
      setErrors({ ...errors, [props.name]: errorMessage });
    },
  });

  return (
    <div className={mapModifiers('a-fileinput', props.modifiers)} {...getRootProps()}>
      <Image src={cloud} alt="drag and drop" />
      <div className="a-fileinput_handle">
        <Text modifiers="gray"> Drag it here or</Text>
        <Button handleClick={open} modifiers="asLink">
          Choose file
        </Button>
      </div>
      <input {...getInputProps()} className="a-fileinput_input" name={props.name} type="file" />
      <Text modifiers={['lightgray']}>{props.label}</Text>
    </div>
  );
};

export default hot(FileInput);
