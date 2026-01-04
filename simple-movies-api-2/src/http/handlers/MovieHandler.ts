import Response from "../Response.js";
import Validator from "../Validator.js";
import Database from "../../database.js";
import { ObjectId } from "mongodb";
import Request from "../Request.js";




export default class MovieHandler {
    private db: Database;
    constructor() {
        this.db = new Database();
    }

    async index(): Promise<Response> {
        const movies = await this.db.all();

        return new Response({
            data: movies
        });
    }

    async show(request: Request, id: string): Promise<Response> {
        const validator = Validator.make({ id }, { id: ['string', 'size:24'] })
        if (!validator.validate()) {
            return new Response({
                message: 'Unprocessable Content.',
                error: validator.getMessages()
            }, 422);
        }

        const movie = await this.db.findById(id);

        if (!movie) {
            return new Response({
                message: `Movie with given id ${id} not found.`
            }, 404);
        }

        return new Response(movie);
    }

    async store(request: Request): Promise<Response> {
        const payload = await request.body;
        const validator = Validator.make(payload, {
            title: ['required', 'string', 'min:8', 'max:30'],
            description: ['nullable', 'string', 'min:10', 'max:200'],
            cast: ['required', 'array', 'min:2'],
            director: ['required', 'string', 'min:8', 'max:50'],
            releaseDate: ['required', 'string', 'date']
        })

        if (!validator.validate()) {
            return new Response({
                message: 'Unprocessable Content.',
                error: validator.getMessages()
            }, 422);
        }

        if (await this.db.findBy({ title: validator.input('title') })) {
            return new Response({
                message: `Movie with title: '${validator.input('title')}' already exists`
            }, 422);
        }

        const result = await this.db.create({
            title: validator.input('title'),
            description: validator.input('description'),
            cast: validator.input('cast'),
            director: validator.input('director'),
            releaseDate: validator.input('releaseDate')
        })

        return new Response({
            message: 'Movie has been added.',
            movieId: result.insertedId
        }, 201);
    }

    async update(request: Request, id: string): Promise<Response> {
        const validator = Validator.make({ ...await request.body, id }, {
            id: ['string', 'size:24'],
            title: ['required', 'string', 'min:8', 'max:30'],
            description: ['nullable', 'string', 'min:10', 'max:200'],
            cast: ['required', 'array', 'min:2'],
            director: ['required', 'string', 'min:8', 'max:50'],
            releaseDate: ['required', 'string', 'date']
        });

        if (!validator.validate()) {
            return new Response({
                message: 'Unprocessable Content.',
                error: validator.getMessages()
            }, 422);
        }

        const filter = {
            _id: { $ne: new ObjectId(id) },
            title: validator.input('title'),
        }
        if (await this.db.findBy(filter)) {
            return new Response({
                message: `Movie with title: '${validator.input('title')}' already exists`
            }, 422);
        }

        await this.db.update({
            _id: new ObjectId(id)
        }, {
            $set: {
                title: validator.input('title'),
                description: validator.input('description'),
                cast: validator.input('cast'),
                director: validator.input('director'),
                releaseDate: validator.input('releaseDate')
            }
        });

        return new Response({
            message: 'Movie has been updated.',
            movieId: id
        })
    }

    async delete(request: Request, id: string): Promise<Response> {
        const validator = Validator.make({ id }, { id: ['string', 'size:24'] })
        if (!validator.validate()) {
            return new Response({
                message: 'Unprocessable Content.',
                error: validator.getMessages()
            }, 422);
        }

        const result = await this.db.delete({
            _id: new ObjectId(id)
        });

        return new Response({
            message: `Movie with id: ${id} has been deleted (if it was exists).`,
            isDeleted: Boolean(result.deletedCount)
        });
    }
}