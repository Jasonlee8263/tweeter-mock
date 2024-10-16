import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";
import { Buffer } from "buffer";

export class RegisterPresenter extends UserPresenter {
  public async doRegister(
    alias: string,
    password: string,
    rememberMe: boolean,
    firstName: string,
    lastName: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ) {
    await this.doAuth(() =>
      this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      )
    );
  }

  public handleImageFile = (
    file: File | undefined,
    setImageUrl: (url: string) => void,
    setImageBytes: (bytes: Uint8Array) => void,
    setImageFileExtension: (ext: string) => void
  ) => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        setImageFileExtension(fileExtension);
      }
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
    }
  };

  public getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  protected getItemDescription(): string {
    return "register user";
  }
}
