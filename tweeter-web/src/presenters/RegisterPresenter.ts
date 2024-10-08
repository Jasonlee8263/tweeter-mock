import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";
import { Buffer } from "buffer";

export class RegisterPresenter extends UserPresenter {
  private userService: UserService;
  constructor(view: UserView) {
    super(view);
    this.userService = new UserService();
  }
  public async doAuth(
    alias: string,
    password: string,
    rememberMe: boolean,
    firstName: string,
    lastName: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  // public handleImageFile = (file: File | undefined) => {
  //   if (file) {
  //     setImageUrl(URL.createObjectURL(file));

  //     const reader = new FileReader();
  //     reader.onload = (event: ProgressEvent<FileReader>) => {
  //       const imageStringBase64 = event.target?.result as string;

  //       // Remove unnecessary file metadata from the start of the string.
  //       const imageStringBase64BufferContents =
  //         imageStringBase64.split("base64,")[1];

  //       const bytes: Uint8Array = Buffer.from(
  //         imageStringBase64BufferContents,
  //         "base64"
  //       );

  //       setImageBytes(bytes);
  //     };
  //     reader.readAsDataURL(file);

  //     // Set image file extension (and move to a separate method)
  //     const fileExtension = this.getFileExtension(file);
  //     if (fileExtension) {
  //       setImageFileExtension(fileExtension);
  //     }
  //   } else {
  //     setImageUrl("");
  //     setImageBytes(new Uint8Array());
  //   }
  // };

  public getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };
}
