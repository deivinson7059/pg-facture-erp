declare module '@ckeditor/ckeditor5-build-classic' {
  const ClassicEditorBuild: any;

  export default ClassicEditorBuild;
  
  // Define cualquier interfaz adicional que necesites
  export interface EditorConfig {
    toolbar?: any;
    language?: string;
    placeholder?: string;
    [key: string]: any;
  }
}

declare module '@ckeditor/ckeditor5-angular' {
  export class CKEditorModule {}
}