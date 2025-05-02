import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// You can define an interface for context if you'd like
interface AuthContext {
    user: {
        _id: string;
        username: string;
        email: string;
    } | null;
}

const resolvers = {
    Query: {
        me: async (
            _parent: unknown,
            _args: unknown,
            context: AuthContext
        ) => {
            if (context.user) {
                return await User.findById(context.user._id);
            }
            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        addUser: async (
            _parent: unknown,
            args: { username: string; email: string; password: string }
        ) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (
            _parent: unknown,
            args: { email: string; password: string }
        ) => {
            const { email, password } = args;
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (
            _parent: unknown,
            args: {
                bookInput: {
                    bookId: string;
                    authors?: string[];
                    description?: string;
                    title: string;
                    image?: string;
                    link?: string;
                };
            },
            context: AuthContext
        ) => {
            if (!context.user) throw new AuthenticationError('Login required');
            return await User.findByIdAndUpdate(
                context.user._id,
                { $addToSet: { savedBooks: args.bookInput } },
                { new: true, runValidators: true }
            );
        },

        removeBook: async (
            _parent: unknown,
            args: { bookId: string },
            context: AuthContext
        ) => {
            if (!context.user) throw new AuthenticationError('Login required');
            return await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );
        },
    },
};

export default resolvers;
