import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface Usuario {
    id: string;
    nombre: string;
    empresa?: string;
    email?: string;
    ciudad?: string;
    direccion?: string;
    telefono?: string;
    contacto?: string;
}
@Component({
    selector: 'app-customer-autocomplete',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './customer-autocomplete.component.html',
    styleUrl: './customer-autocomplete.component.scss'
})
export class CustomerAutocompleteComponent implements OnInit {
    @Input() placeholder: string = 'Buscar Cliente/Proveedor';
    @Input() mostrarBotonCrear: boolean = true;
    @Input() textoBotonCrear: string = 'Crear';
    @Input() textoBusquedaVacia: string = 'No Resultados De Busqueda...';
    @Input() textoCrearNuevo: string = 'CREAR NUEVO USUARIO';
    
    @Output() seleccionarUsuario = new EventEmitter<Usuario>();
    @Output() crearNuevoUsuario = new EventEmitter<void>();
    @Output() editarUsuario = new EventEmitter<Usuario>();
    @Output() verPerfil = new EventEmitter<Usuario>();
    @Output() buscar = new EventEmitter<string>();
    @Output() cancelarSeleccion = new EventEmitter<void>();
    
    busquedaControl = new FormControl('');
    resultados: Usuario[] = [];
    mostrarResultados = false;
    resultadoActivo = -1;
    usuarioSeleccionado: Usuario | null = null;
    busquedaVacia = false;
    
    constructor() {}
    
    ngOnInit(): void {
      this.busquedaControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(valor => {
        if (valor) {
          this.buscar.emit(valor);
          this.busquedaVacia = this.resultados.length === 0;
        } else {
          this.resultados = [];
          this.busquedaVacia = false;
        }
        this.mostrarResultados = valor ? true : false;
      });
      
      // Datos de ejemplo para demostración
      this.resultados = [
        { id: '4444444', nombre: 'LOPEZ PEDRO', empresa: '' },
        { id: '19320407', nombre: 'LA CAJITA DE LOS ADORNSO', empresa: '' },
        { id: '860512330', nombre: 'SERVIENTREGA S.A.', empresa: '' },
        { id: '134545454', nombre: 'PEDRO PER PERES', empresa: '' },
        { id: '5581557', nombre: 'Pedro Nel Delgado Chaparro', empresa: '' }
      ];
    }
    
    seleccionarItem(usuario: Usuario): void {
      this.usuarioSeleccionado = usuario;
      this.busquedaControl.setValue('');
      this.mostrarResultados = false;
      this.seleccionarUsuario.emit(usuario);
    }
    
    crearNuevo(): void {
      this.crearNuevoUsuario.emit();
      this.busquedaControl.setValue('');
      this.mostrarResultados = false;
    }
    
    editar(): void {
      if (this.usuarioSeleccionado) {
        this.editarUsuario.emit(this.usuarioSeleccionado);
      }
    }
    
    verPerfilUsuario(): void {
      if (this.usuarioSeleccionado) {
        this.verPerfil.emit(this.usuarioSeleccionado);
      }
    }
    
    cancelar(): void {
      this.usuarioSeleccionado = null;
      this.cancelarSeleccion.emit();
    }
    
    cambiarResultadoActivo(indice: number): void {
      this.resultadoActivo = indice;
    }
    
    manejarTecla(evento: KeyboardEvent): void {
      if (!this.mostrarResultados) return;
      
      switch (evento.key) {
        case 'ArrowDown':
          this.resultadoActivo = Math.min(this.resultadoActivo + 1, this.resultados.length - 1);
          evento.preventDefault();
          break;
        case 'ArrowUp':
          this.resultadoActivo = Math.max(this.resultadoActivo - 1, 0);
          evento.preventDefault();
          break;
        case 'Enter':
          if (this.resultadoActivo >= 0 && this.resultadoActivo < this.resultados.length) {
            this.seleccionarItem(this.resultados[this.resultadoActivo]);
          } else if (this.resultadoActivo === this.resultados.length) {
            this.crearNuevo();
          }
          evento.preventDefault();
          break;
        case 'Escape':
          this.mostrarResultados = false;
          evento.preventDefault();
          break;
      }
    }
  }