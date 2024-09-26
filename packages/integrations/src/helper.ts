export const getTrackingImage = (body: string, id: string): string => {
    const bodyWithTrackingImage =
      body +
      `<img src="https://d8c46a2ca9e6.ngrok.app/email-open/1px-image?id=${id}" style="display:none;" width="1" height="1" alt="" />`;
    return bodyWithTrackingImage;
  };