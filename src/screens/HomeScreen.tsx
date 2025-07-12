import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import notifee from '@notifee/react-native';

export default function HomeScreen() {
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const postRes = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
            );
            const postsData = await postRes.json();
            const userRes = await fetch(`https://jsonplaceholder.typicode.com/users`);
            const usersData = await userRes.json();

            const combined = postsData.map((post: any) => ({
                ...post,
                user: usersData.find((u: any) => u.id === post.userId),
                liked: false,
                likes: Math.floor(Math.random() * 100),
                showComments: false,
                comments: [],
                newComment: '',
                showHeart: false, // for heart animation
            }));

            setPosts((prev) => [...prev, ...combined]);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (index: number) => {
        try {
            const updated = [...posts];
            updated[index].liked = !updated[index].liked;
            updated[index].likes += updated[index].liked ? 1 : -1;

            if (updated[index].liked) {
                updated[index].showHeart = true;
                setPosts([...updated]);

                setTimeout(() => {
                    const temp = [...updated];
                    temp[index].showHeart = false;
                    setPosts([...temp]);
                }, 800);

                await showLikeNotification(updated[index].user?.name || 'someone');
            } else {
                setPosts(updated);
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    async function showLikeNotification(userName: string) {
        try {
            await notifee.requestPermission();
            const channelId = await notifee.createChannel({
                id: 'important',
                name: 'likes',
            });

            await notifee.displayNotification({
                title: 'You liked a post!',
                body: `You liked ${userName}'s post.`,
                android: {
                    channelId,
                    smallIcon: 'ic_launcher',
                },
            });
        } catch (error) {
            console.error('Notification error:', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => setPage((prev) => prev + 1)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator /> : null}
                renderItem={({ item, index }) => (
                    <View style={styles.postContainer}>
                        <View style={styles.userRow}>
                            <Image
                                source={{ uri: `https://i.pravatar.cc/150?img=${item.userId}` }}
                                style={styles.avatar}
                            />
                            <Text style={styles.userName}>{item.user?.name}</Text>
                        </View>
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: `https://picsum.photos/seed/${item.id}/300/200` }}
                                style={styles.postImage}
                            />
                            {item.showHeart && (
                                <View style={styles.heartOverlay}>
                                    <Icon name="heart" size={80} color="rgba(255,0,0,0.85)" />
                                </View>
                            )}
                        </View>

                        <View style={styles.commentLikeRow}>
                            <TouchableOpacity
                                onPress={() => {
                                    const updated = [...posts];
                                    updated[index].showComments = !updated[index].showComments;
                                    setPosts(updated);
                                }}
                            >
                                <Text style={styles.commentToggleText}>
                                    {item.showComments ? 'Hide Comments' : 'Comment'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => toggleLike(index)} style={styles.likeRow}>
                                <Icon
                                    name={item.liked ? 'heart' : 'heart-outline'}
                                    size={20}
                                    color={item.liked ? 'red' : 'black'}
                                />
                                <Text style={styles.likesText}>{item.likes} Likes</Text>
                            </TouchableOpacity>
                        </View>

                        {item.showComments && (
                            <View style={styles.commentsContainer}>
                                {item.comments.map((comment: any) => (
                                    <Text key={comment.id} style={styles.commentText}>
                                        💬 {comment.text}
                                    </Text>
                                ))}
                                <View style={styles.commentInputRow}>
                                    <TextInput
                                        value={item.newComment}
                                        onChangeText={(text) => {
                                            const updated = [...posts];
                                            updated[index].newComment = text;
                                            setPosts(updated);
                                        }}
                                        placeholder="Write a comment..."
                                        style={styles.commentInput}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (!item.newComment.trim()) return;
                                            const updated = [...posts];
                                            updated[index].comments.push({
                                                id: Date.now(),
                                                text: item.newComment,
                                            });
                                            updated[index].newComment = '';
                                            setPosts(updated);
                                        }}
                                        style={styles.sendButton}
                                    >
                                        <Icon name="send" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    postContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userName: {
        marginLeft: 10,
        fontWeight: 'bold',
    },
    postTitle: {
        marginVertical: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    commentLikeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    likeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likesText: {
        marginLeft: 6,
    },
    commentToggleText: {
        fontWeight:"700",
        color: '#b3203d',
    },
    commentsContainer: {
        marginTop: 10,
    },
    commentText: {
        paddingVertical: 2,
        paddingLeft: 10,
    },
    commentInputRow: {
        flexDirection: 'row',
        marginTop: 6,
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 8,
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: '#b3203d',
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartOverlay: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
});
