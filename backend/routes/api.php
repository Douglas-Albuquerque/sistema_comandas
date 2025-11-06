<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\ProfileController;

// Rotas públicas
Route::post('/login', [LoginController::class, 'login']);

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/me', [LoginController::class, 'me']);

    // Perfil (qualquer usuário logado)
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::put('/password', [ProfileController::class, 'updatePassword']);
        //Route::post('/avatar', [ProfileController::class, 'uploadAvatar']);
        //Route::delete('/avatar', [ProfileController::class, 'deleteAvatar']);
    });

    // Admin: Roles (requer permissão)
    Route::middleware('permission:usuarios')->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
    });

    // Admin: Users (requer permissão)
    Route::middleware('permission:usuarios')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
