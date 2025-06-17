import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import cors from 'cors';
import { createClient } from 'redis';
import { instrument } from '@socket.io/admin-ui';
import { config } from 'dotenv';
import mongoose from 'mongoose';
config();
const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());