import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { MensajeService } from '../../services/message.service';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageReq } from '../../interfaces';
import { DatePicker } from 'primeng/datepicker';
import { FileUpload } from 'primeng/fileupload';
import { Badge } from 'primeng/badge';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-messages',
  imports: [
    FieldsetModule,
    Button,
    DialogModule,
    Tooltip,
    FormsModule,
    Textarea,
    TableModule,
    DatePipe,
    FloatLabel,
    DatePicker,
    FileUpload,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  private cloudinaryService = inject(CloudinaryService);
  mensajeService = inject(MensajeService);
  mensajes = this.mensajeService.messages;
  @ViewChild('fileUploader') fileUploader!: FileUpload;
  @ViewChild('fileUploaderUpdate') fileUploaderUpdate!: FileUpload;

  visible = signal(false);

  uploadedFiles: any[] = [];
  uploadedFilesUpdate: any[] = [];
  newImagesToUpload: File[] = [];
  imageUrls: string[] = [];

  loading = false;

  dataReg: MessageReq = {
    message: '',
    images: [],
    sendOn: new Date()
  }

  ngOnInit(): void {
    this.getAllMessages();
  }

  showDialog() {
    this.visible.set(true);
  }

  closeDialog() {
    this.visible.set(false);
  }

  getAllMessages() {
    this.mensajeService.getAllMessages().subscribe();
  }

  resetUploader() {
    this.uploadedFiles = [];
    this.imageUrls = [];
    if (this.fileUploader) {
      this.fileUploader.clear();
      this.fileUploader.files = [];
    }
  }

  resetUpdateUploader() {
    this.newImagesToUpload = [];
    this.imageUrls = [];
    if (this.fileUploaderUpdate) {
      this.fileUploaderUpdate.clear();
      this.fileUploaderUpdate.files = [];
    }
  }

  onSelectUpdate(event: any) {
    // Agregamos los nuevos archivos a la lista para subir
    this.newImagesToUpload.push(...event.files);

    // Mostramos una vista previa de los archivos
    for (let file of event.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedFilesUpdate.push({
          file: file,
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImageUpdate(index: number) {
    const item = this.uploadedFilesUpdate[index];

    // Si es una nueva imagen (aún no subida), la quitamos de la lista
    if (item.file) {
      this.newImagesToUpload = this.newImagesToUpload.filter(f => f !== item.file);
    }

    this.uploadedFilesUpdate.splice(index, 1);
  }

  onSelect(event: any) {
    for (let file of event.files) {
      this.uploadToCloudinary(file);
    }
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  uploadToCloudinary(file: File) {
    // Mostrar un mensaje de carga
    this.messageService.add({ severity: 'info', summary: 'Subiendo imagen', detail: 'Espere un momento...' });

    this.cloudinaryService.uploadImage(file).subscribe({
      next: (response) => {
        // Guardar la URL de la imagen
        const imageUrl = response.secure_url;

        this.imageUrls.push(imageUrl);

        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen subida'
        });
      },
      error: (error) => {
        console.error('Error al subir la imagen:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al subir la imagen',
          detail: 'Ocurrió un error al subir la imagen a Cloudinary.'
        });
      }
    });
  }

  registerMessage() {
    this.loading = true;

    this.mensajeService.createMessage(this.dataReg.message, this.imageUrls, this.dataReg.sendOn).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mensaje registrado',
          detail: 'El mensaje ha sido registrado.'
        });
        this.loading = false;
        this.closeDialog();
        this.resetUploader();
      },
      error: (error) => {
        console.error('Error al registrar el mensaje:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al registrar el mensaje',
          detail: 'Ocurrió un error al registrar el mensaje.'
        });
        this.loading = false;
      }
    });
  }

}
